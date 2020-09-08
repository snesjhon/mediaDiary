import React, { useState, Fragment, useContext } from "react";
import { Heading, Input, Text, Flex, Box } from "@chakra-ui/core";
import useSWR from "swr";
import useDebounce from "../utils/useDebounce";
// import { fuego } from "@nandorojo/swr-firestore";
// import useUser from "../utils/useUser";
import { ContextDispatch } from "../utils/store";
import type { MediaSelected, MediaTypes } from "../types/mediaTypes";
import LogoFilm from "./Icons/LogoFilm";

const fetcher = (input: RequestInfo) => fetch(input).then((res) => res.json());

interface MediaSearchListProps {
  item: any;
  children(props: { name: string; artist: string; date: string }): JSX.Element;
  itunesType: MediaTypes;
}

function MediaSearchList({ itunesType, item, children }: MediaSearchListProps) {
  return children({
    name: itunesType === "feature-movie" ? item.trackName : item.collectionName,
    artist: item.artistName,
    date: new Date(item.releaseDate).toLocaleDateString("en-us", {
      year: "numeric",
    }),
  });
}

function Search() {
  const [search, setSearch] = useState("");
  const dispatch = useContext(ContextDispatch);

  const bouncedSearch = useDebounce(search, 500);
  const { data, isValidating, error } = useSWR(
    bouncedSearch === ""
      ? null
      : `https://itunes.apple.com/search?term=${encodeURIComponent(
          bouncedSearch
        )}&entity=movie,album,tvSeason`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <>
      <Heading>Search for Media</Heading>
      <Input
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="search"
      />
      {!data && isValidating && <div>loading</div>}
      {data?.resultCount === 0 && <div>nothing found</div>}
      {data &&
        data.results.map((e: any, i: string) => {
          const currentType: MediaTypes = e.collectionType || e.kind;
          return (
            <MediaSearchList
              key={`${e.collectionId}_${i}`}
              itunesType={currentType}
              item={e}
            >
              {({ artist, date, name }) => (
                <Flex
                  alignItems="center"
                  borderBottom="1px"
                  borderBottomColor="gray.200"
                  py={3}
                  px={2}
                  _hover={{
                    bg: "purple.50",
                    cursor: "pointer",
                  }}
                >
                  <Box w="6%" display="flex">
                    {currentType === "feature-movie" && <LogoFilm />}
                    {currentType === "Album" && <LogoFilm />}
                    {currentType === "TV Season" && <LogoFilm />}
                  </Box>
                  <Box w="54%">
                    <Text>{name}</Text>
                  </Box>
                  <Box w="30%">
                    <Text>{artist}</Text>
                  </Box>
                  <Box w="10%">
                    <Text>{date}</Text>
                  </Box>
                </Flex>
              )}
            </MediaSearchList>
          );
        })}
    </>
  );

  function mediaNormalize(item: any, type: MediaTypes) {
    let id, poster, title, published, overview, watched, artist, backdrop;
    if (type === "feature-movie") {
      id = item.id.toString();
      poster = item.poster_path;
      backdrop = item.backdrop_path;
      title = item.title;
      published = item.release_date;
      overview = item.overview;
      artist = typeof item.director !== "undefined" && item.director;
    } else if (type === "TV Season") {
      id = item.id.toString();
      poster = item.poster_path;
      backdrop = item.poster_path;
      title = item.name;
      published = item.first_air_date;
      overview = item.overview;
      artist = typeof item.creator !== "undefined" && item.creator;
    } else if (type === "Album") {
      id = encodeURIComponent(item.artistName + item.collectionName);
      poster = item.artworkUrl100;
      title = item.collectionName;
      artist = item.artistName;
      published = item.releaseDate;
      overview = "";
    }
    const mediaReturn: MediaSelected = {
      id,
      poster,
      title,
      published,
      overview,
      watched,
      artist,
      type,
      backdrop,
    };
    return mediaReturn;
  }

  // function addData() {
  //   const batch = fuego.db.batch();
  //   batch.set(fuego.db.collection(user.email).doc("media"), {
  //     title: "jhon4" + new Date(),
  //   });
  //   batch.set(fuego.db.collection(user.email).doc("diary"), {
  //     title: "jhon5" + new Date(),
  //   });

  //   batch.commit().then(() => {
  //     console.log("happened");
  //   });
  // }
}

export default Search;
