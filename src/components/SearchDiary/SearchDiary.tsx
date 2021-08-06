import { useFuegoUser } from "@/fuego";
import { MdContentHeader } from "@/md";
import type { MediaDiaryWithId } from "@/types";
import { useIsBreakpoint } from "@/utils";
import useDebounce from "@/utils/useDebounce";
import { Input, Text, HStack, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import useSWR from "swr";
import { fuegoDiarySearch } from "../Content/config/fuego";
import SearchMedia from "../SearchMedia";

export default function SearchDiary(): JSX.Element {
  const { user } = useFuegoUser();
  const isMd = useIsBreakpoint("md");
  const [search, setSearch] = useState("");
  const bouncedSearch = useDebounce(search, 500);
  const { data, isValidating } = useSWR<MediaDiaryWithId[]>(
    bouncedSearch !== "" && user
      ? [`/fuegoSearch/${bouncedSearch}`, user.uid, bouncedSearch]
      : null,
    fuegoDiarySearch,
    { revalidateOnFocus: false }
  );

  return (
    <Box pos="relative">
      <MdContentHeader
        title="Search"
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
            placeholder="Search for Memories, Bookmarks, or Diary"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="search"
            autoFocus
            size={!isMd ? "sm" : undefined}
            minW={isMd ? "sm" : undefined}
          />
        </HStack>
      </MdContentHeader>
      <Box
        borderLeftWidth={{ base: 0, md: "1px" }}
        borderRightWidth={{ base: 0, md: "1px" }}
        pb="10"
        minH="83vh"
      >
        {data && data.length > 0 && <SearchMedia data={data} />}
        {data && data.length === 0 && <div>No Data</div>}
        {!data && !isValidating && <div>Search For something</div>}
      </Box>
    </Box>
  );
}
