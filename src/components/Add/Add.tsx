import { useMDState } from "@/config";
import { MdSpinner } from "@/md";
import { fetcher, spotifyFetch } from "@/utils";
import useDebounce from "@/utils/useDebounce";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import { AddResults } from "./components";
import type { MDbSearch, SpotifySearch } from "./types";

export default function Add(): JSX.Element {
  const { preference } = useMDState();
  const [search, setSearch] = useState("");

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
    <Box pos="relative">
      <Box
        position="sticky"
        top="3rem"
        pt="2"
        zIndex="1"
        bgColor="white"
        borderBottomWidth="1px"
      >
        <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
          <Flex alignItems="baseline">
            <Heading size="lg" mr="2">
              Add Media
            </Heading>
            <Tooltip
              label={
                <Text>
                  Diary includes all rated and <br />
                  unrated Media that have dates <br />
                  attached to them.
                </Text>
              }
            >
              <QuestionOutlineIcon />
            </Tooltip>
          </Flex>
          <HStack spacing={{ base: 0, sm: 3 }}>
            <Input
              placeholder="Search for Albums, TV, or Film"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              type="search"
              autoFocus
              minW="sm"
            />
          </HStack>
        </Flex>
      </Box>
      <Box
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderRightWidth={{ base: 0, md: "1px" }}
        px={{ md: 8 }}
      >
        {!data && isValidating && (
          <Center h="20vh">
            <MdSpinner />
          </Center>
        )}
        {data && (
          <AddResults
            data={data}
            showAlbum={showAlbum}
            showMovie={showMovie}
            showTV={showTV}
          />
        )}
      </Box>
    </Box>
  );

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
