import {
  Box,
  Flex,
  Heading,
  Input,
  Text,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useState, useRef } from "react";
import useSWR from "swr";
import Header from "./Header";
import LogoFilm from "./Icons/LogoFilm";
import Layout from "./Layout";
import type { MediaSelected, MediaTypes } from "../types/mediaTypes";
import { ContextDispatch } from "../utils/store";
import useDebounce from "../utils/useDebounce";

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
  const router = useRouter();
  const SearchRef = useRef<HTMLInputElement>(null);

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
    <Modal
      isOpen={true}
      onClose={() => router.push("/")}
      scrollBehavior="inside"
      size="sm"
      initialFocusRef={SearchRef}
    >
      <ModalOverlay px={4}>
        <ModalContent maxHeight="70vh">
          <ModalCloseButton />
          <ModalHeader pb={2}>Search for Media</ModalHeader>
          <ModalBody pt={0} pb={6}>
            <Box position="sticky" pt={1} top={0} bgColor="white">
              <Input
                placeholder="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="search"
                ref={SearchRef}
              />
            </Box>
            {!data && isValidating && (
              <Center h="20vh">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                />
              </Center>
            )}
            {data?.resultCount === 0 && <div>nothing found</div>}
            {data &&
              data.results.map((e: any, i: string) => {
                let currentType = e.collectionType || e.kind;
                if (currentType === "feature-movie") currentType = "movie";
                else if (currentType === "Album") currentType = "album";
                else if (currentType === "TV Season") currentType = "tv";
                return (
                  <MediaSearchList
                    key={`${e.collectionId}_${i}`}
                    type={currentType}
                    item={e}
                  >
                    {({ artist, date, name }) => (
                      <Flex
                        fontSize="sm"
                        alignItems="center"
                        borderBottom="1px"
                        borderBottomColor="gray.200"
                        py={2}
                        _hover={{
                          bg: "purple.50",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          dispatch({
                            type: "select",
                            payload: mediaNormalize(e, currentType),
                          });
                          router.push("/?log=true", "/log", {
                            shallow: true,
                          });
                        }}
                      >
                        <Box w="10%" display="flex">
                          {currentType === "movie" && <LogoFilm />}
                          {currentType === "album" && <LogoFilm />}
                          {currentType === "tv" && <LogoFilm />}
                        </Box>
                        <Box w="90%">
                          <Text>{name}</Text>
                          <Text
                            fontSize="xs"
                            fontStyle="italic"
                            color="gray.500"
                          >
                            {artist} • {date}
                          </Text>
                        </Box>
                      </Flex>
                    )}
                  </MediaSearchList>
                );
              })}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );

  function mediaNormalize(item: any, type: MediaTypes): MediaSelected {
    return {
      id: type === "movie" ? item.trackId : item.collectionId,
      poster: item.artworkUrl100.replace("100x100", "500x500"),
      title: type === "movie" ? item.trackName : item.collectionName,
      releasedDate: item.releaseDate,
      overview: item.longDescription,
      artist: item.artistName,
      genre: item.primaryGenreName,
      type,
    };
  }
}

export default Search;
