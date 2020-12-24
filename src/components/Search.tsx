import { useColorMode } from "@chakra-ui/react";
import type { Icon } from "@chakra-ui/react";
import { Box, Center, Flex, Input, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { RefObject } from "react";
import React, { useState } from "react";
import useSWR from "swr";
import type { MediaSelected, MediaTypes } from "../config/types";
import { useMDDispatch, useMDState } from "../config/store";
import useDebounce from "../hooks/useDebounce";
import AlbumIcon from "./icons/AlbumIcon";
import FilmIcon from "./icons/FilmIcon";
import TvIcon from "./icons/TvIcon";
import MdSpinner from "./md/MdSpinner";

function Search({
  refInput,
}: {
  refInput: RefObject<HTMLInputElement>;
}): JSX.Element {
  const [search, setSearch] = useState("");
  const [currMovie, setCurrMovie] = useState(3);
  const [currTv, setCurrTv] = useState(3);
  const [currAlbum, setCurrAlbum] = useState(3);
  const dispatch = useMDDispatch();
  const { spotifyToken } = useMDState();
  const { colorMode } = useColorMode();

  const bouncedSearch = useDebounce(search, 500);
  const { data, isValidating } = useSWR(
    bouncedSearch === "" ? null : `/mediaSearch/${bouncedSearch}`,
    searchFetcher,
    { revalidateOnFocus: false }
  );

  return (
    <>
      <Box
        position="sticky"
        pt={1}
        top={0}
        bg={colorMode === "light" ? "white" : "gray.700"}
      >
        <Input
          placeholder="Search for Albums, TV, or Film"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="search"
          ref={refInput}
          autoFocus
        />
      </Box>
      {!data && isValidating && (
        <Center h="20vh">
          <MdSpinner />
        </Center>
      )}
      {data && createData(data)}
    </>
  );

  function createData(data: any) {
    const mdbData = data[0];
    const spotifyData = data[1];
    const albumData = spotifyData.albums.items.map((e: any) =>
      mediaNormalize(e)
    );
    const filteredData: MediaSelected[] = mdbData.results
      .map((e: any) => mediaNormalize(e))
      .filter((e: any) => e.type !== "person");
    const { movieData, tvData } = filteredData.reduce<{
      movieData: MediaSelected[];
      tvData: MediaSelected[];
    }>(
      (a, c: MediaSelected) => {
        if (c.type === "movie") {
          a["movieData"].push(c);
        } else if (c.type === "tv") {
          a["tvData"].push(c);
        }
        return a;
      },
      { movieData: [], tvData: [] }
    );

    return (
      <>
        <CreateList
          data={movieData}
          title="Movie"
          DataIcon={FilmIcon}
          seeNumber={currMovie}
          seeAction={setCurrMovie}
        />
        <CreateList
          data={tvData}
          title="TV"
          DataIcon={TvIcon}
          seeNumber={currTv}
          seeAction={setCurrTv}
        />
        <CreateList
          data={albumData}
          title="Album"
          DataIcon={AlbumIcon}
          seeNumber={currAlbum}
          seeAction={setCurrAlbum}
        />
      </>
    );
  }

  function CreateList({
    data,
    title,
    DataIcon,
    seeNumber,
    seeAction,
  }: {
    data: MediaSelected[];
    title: string;
    DataIcon: typeof Icon;
    seeNumber: number;
    seeAction: typeof setCurrMovie;
  }) {
    return data.length > 0 ? (
      <Box mt={4}>
        <Flex alignItems="center">
          <DataIcon color="purple.500" />
          <Text ml={2} fontWeight="bold">
            {title}
          </Text>
        </Flex>
        {data.slice(0, seeNumber).map((e: MediaSelected) => displayResult(e))}
        {data.length > seeNumber && (
          <Text mt={3} fontSize="sm" onClick={() => seeAction(seeNumber + 3)}>
            See More...
          </Text>
        )}
      </Box>
    ) : null;
  }

  function displayResult(item: MediaSelected) {
    return (
      <Box
        key={item.mediaId}
        fontSize="sm"
        borderBottom="1px"
        borderBottomColor="gray.200"
        py={2}
        _hover={{
          bg: colorMode === "light" ? "purple.50" : "gray.800",
          cursor: "pointer",
        }}
        onClick={() =>
          dispatch({
            type: "log",
            payload: item,
          })
        }
      >
        <Text>{item.title}</Text>
        {item.artist !== "" ? (
          <Text fontSize="xs" fontStyle="italic" color="gray.500">
            {item.artist}
          </Text>
        ) : item.releasedDate !== "" ? (
          <Text fontSize="xs" fontStyle="italic" color="gray.500">
            {dayjs(item.releasedDate).format("YYYY")}
          </Text>
        ) : null}
      </Box>
    );
  }

  function mediaNormalize(item: any): MediaSelected {
    const type: MediaTypes =
      typeof item?.media_type !== "undefined" ? item.media_type : "album";

    if (type === "album") {
      return {
        mediaId: item.id,
        poster: item.images[0].url,
        title: item.name,
        releasedDate: dayjs(item.release_date).toISOString(),
        artist: item.artists[0].name,
        artistId: item.artists[0].id,
        genre: "",
        type,
      };
    } else {
      let released;
      try {
        released = dayjs(
          type === "movie" ? item.release_date : item.first_air_date
        ).toISOString();
      } catch {
        released = type === "movie" ? item.release_date : item.first_air_date;
      }
      return {
        mediaId: item.id,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        title: type === "movie" ? item.title : item.original_name,
        releasedDate: released,
        genre: "",
        artist: "",
        type,
      };
    }
  }

  function searchFetcher(query: string) {
    // From my recollection it's better to keep a `/{key}/` when using swr, to make sure that caching is properly
    // separated and reusable.
    const queryString = query.substring(13);

    const mdbFetch = fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${
        process.env.NEXT_PUBLIC_MDBKEY
      }&query=${encodeURIComponent(queryString)}&include_adult=false&page=1,2,3`
    ).then((r) => r.json());

    const albumFetch = fetch(
      `https://api.spotify.com/v1/search?q=${queryString}&type=album&limit=20`,
      {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      }
    ).then((r) => r.json());

    return Promise.all([mdbFetch, albumFetch])
      .then((results) => results)
      .catch((e) => console.error(e));
  }
}

export default Search;
