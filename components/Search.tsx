import React, { useState, useContext } from "react";
import { Heading, Input, Text, Flex, Box } from "@chakra-ui/core";
import useSWR from "swr";
import useDebounce from "../utils/useDebounce";
import { ContextDispatch } from "../utils/store";
import type { MediaSelected, MediaTypes } from "../types/mediaTypes";
import LogoFilm from "./Icons/LogoFilm";

const fetcher = (input: RequestInfo) => fetch(input).then((res) => res.json());

interface MediaSearchListProps {
  item: any;
  children(props: { name: string; artist: string; date: string }): JSX.Element;
  type: MediaTypes;
}

function MediaSearchList({ type, item, children }: MediaSearchListProps) {
  return children({
    name: type === "movie" ? item.trackName : item.collectionName,
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
          let currentType: MediaTypes = e.collectionType || e.kind;
          return (
            <MediaSearchList
              key={`${e.collectionId}_${i}`}
              type={currentType}
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
                  onClick={() =>
                    dispatch({
                      type: "select",
                      payload: mediaNormalize(e, currentType),
                    })
                  }
                >
                  <Box w="6%" display="flex">
                    {currentType === "movie" && <LogoFilm />}
                    {currentType === "album" && <LogoFilm />}
                    {currentType === "tv" && <LogoFilm />}
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

  function mediaNormalize(item: any, type: MediaTypes): MediaSelected {
    return {
      id: type === "movie" ? item.trackId : item.collectionId,
      poster: item.artworkUrl100.replace("100x100", "500x500"),
      title: type === "movie" ? item.trackName : item.collectionName,
      releasedDate: item.releaseDate,
      overview: item.longDescription,
      artist: item.artistName,
      type,
    };
  }
}

export default Search;
