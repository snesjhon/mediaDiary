import { useMDState, useMDDispatch } from "@/config";
import type {
  MDbSearch,
  SpotifySearch,
  MediaSelected,
  MediaType,
  SpotifySearchResult,
  MDbSearchResult,
} from "@/types";
import { parsePosterUrl, fetcher, spotifyFetch } from "@/utils";
import useDebounce from "@/utils/useDebounce";
import { Text, Box, Center, Flex, Input, useColorMode } from "@chakra-ui/react";
import type { Icon } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import type { RefObject } from "react";
import useSWR from "swr";
import MdSpinner from "src/components/md/MdSpinner";
import { FilmIcon, TvIcon, AlbumIcon } from "@/icons";

// This is the root of our search Types. This can be extended for future search queries.
// We always want to keep a strict returnArr to ensure that we follow the userPref
type SearchTypes = [MDbSearch | false, SpotifySearch | false];

export default function Search({
  refInput,
}: {
  refInput: RefObject<HTMLInputElement>;
}): JSX.Element {
  const { preference } = useMDState();
  const [search, setSearch] = useState("");
  const [currMovie, setCurrMovie] = useState(3);
  const [currTv, setCurrTv] = useState(3);
  const [currAlbum, setCurrAlbum] = useState(3);
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  const bouncedSearch = useDebounce(search, 500);
  const { data, isValidating } = useSWR(
    bouncedSearch === "" ? null : `/mediaSearch/${bouncedSearch}`,
    searchFetcher,
    { revalidateOnFocus: false }
  );

  const showMovie = (preference && preference?.["mediaTypes"]?.movie) ?? false;
  const showTV = (preference && preference?.["mediaTypes"]?.tv) ?? false;
  const showAlbum = (preference && preference?.["mediaTypes"]?.album) ?? false;

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

  function createData(data: SearchTypes) {
    const mdbData = data[0];
    const spotifyData = data[1];

    let albumData;
    if (showAlbum && spotifyData) {
      albumData = spotifyData.albums.items.map((e) => mediaNormalize(e));
    }

    let tvData;
    let movieData;
    if (mdbData && (showMovie || showTV)) {
      const filteredData: MediaSelected[] = mdbData.results
        .map((e) => mediaNormalize(e))
        // person could also be part of the result, from mdbData
        .filter((e) => (e.type as MediaType & "person") !== "person");

      const { movieOutput, tvOutput } = filteredData.reduce<{
        movieOutput: MediaSelected[];
        tvOutput: MediaSelected[];
      }>(
        (a, c: MediaSelected) => {
          if (c.type === "movie") {
            a["movieOutput"].push(c);
          } else if (c.type === "tv") {
            a["tvOutput"].push(c);
          }
          return a;
        },
        { movieOutput: [], tvOutput: [] }
      );
      if (showMovie) {
        movieData = movieOutput;
      }
      if (showTV) {
        tvData = tvOutput;
      }
    }

    return (
      <>
        {showMovie && movieData && (
          <CreateList
            data={movieData}
            title="Movie"
            DataIcon={FilmIcon}
            seeNumber={currMovie}
            seeAction={setCurrMovie}
          />
        )}
        {showTV && tvData && (
          <CreateList
            data={tvData}
            title="TV"
            DataIcon={TvIcon}
            seeNumber={currTv}
            seeAction={setCurrTv}
          />
        )}
        {showAlbum && albumData && (
          <CreateList
            data={albumData}
            title="Album"
            DataIcon={AlbumIcon}
            seeNumber={currAlbum}
            seeAction={setCurrAlbum}
          />
        )}
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
            type: "selected",
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

  function mediaNormalize(
    item: SpotifySearchResult | MDbSearchResult
  ): MediaSelected {
    const type =
      typeof (item as MDbSearchResult)?.media_type !== "undefined"
        ? (item as MDbSearchResult).media_type
        : "album";

    if (type === "album") {
      // TODO: This is probably not the best solution, but I haven't figured out TS method yet.
      const castItem = item as SpotifySearchResult;
      return {
        mediaId: castItem.id,
        poster: parsePosterUrl(castItem.images[0].url, type),
        title: castItem.name,
        releasedDate: dayjs(castItem.release_date).toISOString(),
        artist: castItem.artists[0].name,
        artistId: castItem.artists[0].id,
        bookmark: false,
        memory: false,
        diary: false,
        genre: "",
        type,
      };
    } else {
      let released;
      const castItem = item as MDbSearchResult;
      try {
        released = dayjs(
          type === "movie" ? castItem.release_date : castItem.first_air_date
        ).toISOString();
      } catch {
        released =
          type === "movie" ? castItem.release_date : castItem.first_air_date;
      }
      return {
        mediaId: castItem.id.toString(),
        poster: castItem.poster_path
          ? parsePosterUrl(castItem.poster_path, type as MediaType)
          : "",
        title:
          type === "movie"
            ? castItem.title ?? ""
            : castItem.original_name ?? "",
        releasedDate: released ?? "",
        genre: "",
        artist: "",
        bookmark: false,
        memory: false,
        diary: false,
        type: type as MediaType,
      };
    }
  }

  async function searchFetcher(query: string) {
    // From my recollection it's better to keep a `/{key}/` when using swr, to make sure that caching is properly
    // separated and reusable.
    const queryString = query.substring(13);

    // We're always going to return two items in this arr. Regardless of the conditional.
    // The conditional will only allows us to determine the call or now. Empty Arr or not.
    const fetchers: [
      Promise<MDbSearch> | false,
      Promise<SpotifySearch> | false
    ] = [false, false];

    if (showMovie || showTV) {
      fetchers[0] = fetcher(
        `https://api.themoviedb.org/3/search/multi?api_key=${
          process.env.NEXT_PUBLIC_MDBKEY
        }&query=${encodeURIComponent(
          queryString
        )}&include_adult=false&page=1,2,3`
      );
    }

    if (showAlbum) {
      fetchers[1] = spotifyFetch(
        `https://api.spotify.com/v1/search?q=${queryString}&type=album&limit=20`
      );
    }

    try {
      const results = await Promise.all<
        MDbSearch | false,
        SpotifySearch | false
      >(fetchers);
      return results;
    } catch (e) {
      return console.error(e);
    }
  }
}
