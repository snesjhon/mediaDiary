import { useMDState } from "@/config";
import { MdContentHeader, MdLoader, MdSpinner } from "@/md";
import { fetcher, spotifyFetch } from "@/utils";
import useDebounce from "@/utils/useDebounce";
import { Box, Center, HStack, Input, Spinner, Text } from "@chakra-ui/react";
import React, { Suspense, useState } from "react";
import useSWR from "swr";
import { AddMovieList, AddResults } from "./components";
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
      <MdContentHeader
        title="Add Media"
        description={
          <Text>
            Diary includes all rated and <br />
            unrated Media that have dates <br />
            attached to them.
          </Text>
        }
      >
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
      </MdContentHeader>
      <Box
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderRightWidth={{ base: 0, md: "1px" }}
        pb="10"
        minH="83vh"
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
        {!data && !isValidating && (
          <Suspense fallback={<MdLoader />}>
            <AddMovieList />
          </Suspense>
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
