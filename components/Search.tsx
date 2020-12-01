import {
  Box,
  Center,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import type { MediaSelected, MediaTypes } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import { fetcher } from "../utils/helpers";
import useDebounce from "../utils/useDebounce";
import AlbumIcon from "./Icons/AlbumIcon";
import FilmIcon from "./Icons/FilmIcon";
import LogoIcon from "./Icons/LogoIcon";
import TvIcon from "./Icons/TvIcon";

function Search(): JSX.Element {
  const [search, setSearch] = useState("");
  const [currMovie, setCurrMovie] = useState(3);
  const [currTv, setCurrTv] = useState(3);
  const [currAlbum, setCurrAlbum] = useState(3);
  const dispatch = useMDDispatch();
  const { view } = useMDState();
  const refInput = useRef<HTMLInputElement>(null);

  const bouncedSearch = useDebounce(search, 500);
  const {
    data: itunesData,
    isValidating: itunesValidating,
    error: itunesError,
  } = useSWR(
    bouncedSearch === ""
      ? null
      : `https://itunes.apple.com/search?term=${encodeURIComponent(
          bouncedSearch
        )}&entity=album&limit=20`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const {
    data: mdbData,
    isValidating: mdbValidating,
    error: mdbError,
  } = useSWR(
    bouncedSearch === ""
      ? null
      : `https://api.themoviedb.org/3/search/multi?api_key=${
          process.env.NEXT_PUBLIC_MDBKEY
        }&query=${encodeURIComponent(
          bouncedSearch
        )}&include_adult=false&page=1,2,3`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <Modal
      isOpen={view === "search"}
      onClose={() =>
        dispatch({ type: "state", payload: { key: "view", value: "" } })
      }
      scrollBehavior="inside"
      size="sm"
      initialFocusRef={refInput}
    >
      <ModalOverlay sx={{ zIndex: 2 }}>
        <ModalContent maxHeight="50vh" my={{ base: 0, sm: "3.75rem" }}>
          <ModalCloseButton />
          <ModalHeader>
            <Flex alignItems="center">
              <LogoIcon boxSize={5} mr={1} />
              <Text
                fontSize={{ base: "md", md: "xl" }}
                color="purple.700"
                fontWeight="medium"
                cursor="pointer"
              >
                mediaDiary
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody pt={0} pb={6}>
            <Box position="sticky" pt={1} top={0} bgColor="white">
              <Input
                placeholder="Search for Albums, TV, or Film"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="search"
                ref={refInput}
                autoFocus
              />
            </Box>
            {(!itunesData || !mdbData) && (itunesValidating || mdbValidating) && (
              <Center h="20vh">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                />
              </Center>
            )}
            {itunesData && mdbData && createData(itunesData, mdbData)}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );

  function createData(itunesData: any, mdbData: any) {
    const albumData = itunesData.results.map((e: any) => mediaNormalize(e));
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
          <Text
            mt={3}
            fontSize="sm"
            color="gray.500"
            onClick={() => seeAction(seeNumber + 3)}
          >
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
          bg: "purple.50",
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
        mediaId: item.collectionId,
        poster: item.artworkUrl100.replace("100x100", "500x500"),
        title: item.collectionName,
        releasedDate: item.releaseDate,
        overview: item.longDescription,
        artist: item.artistName,
        genre: item.primaryGenreName,
        type,
      };
    } else {
      return {
        mediaId: item.id,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        title: type === "movie" ? item.title : item.original_name,
        releasedDate:
          type === "movie" ? item.release_date : item.first_air_date,
        overview: item.overview,
        genre: "",
        artist: "",
        type,
      };
    }
  }
}

export default Search;
