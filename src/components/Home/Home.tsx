import { useMDState } from "@/config";
import { LogoIcon } from "@/icons";
import { MdLoader } from "@/md";
import type { MediaDiaryWithId, UserFuegoValidated } from "@/types";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Button, Heading, HStack, Square } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { cache, useSWRInfinite } from "swr";
import { HomeHeader } from "./components";
import DiaryGrid from "./components/DiaryGrid";
import DiaryList from "./components/DiaryList";
import type { SortType } from "./config";
import { fuegoDiaryGet } from "./config";

export default function Home({
  user,
}: {
  user: UserFuegoValidated;
}): JSX.Element {
  const state = useMDState();
  const [sortType, setSortType] = useState<SortType>({
    type: "diaryDate",
    sort: "desc",
  });
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  const { data, error, size, setSize, mutate } = useSWRInfinite<
    MediaDiaryWithId[]
  >(
    (_, prev) => {
      // We've reached the end of the list since we got < 30, don't call again
      if (prev && prev.length < 30) return null;

      return [
        "/fuego/diary",
        user.uid,
        prev !== null ? prev[prev.length - 1].diaryDate : null,
        sortType,
        state.diaryFilters?.mediaType ?? null,
        state.diaryFilters?.rating ?? null,
        state.diaryFilters?.releasedDecade ?? null,
        state.diaryFilters?.diaryYear ?? null,
        state.diaryFilters?.loggedBefore ?? null,
        state.diaryFilters?.genre ?? null,
      ];
    },
    fuegoDiaryGet,
    {
      revalidateOnFocus: false,
    }
  );

  // Instead of mutating by key in ANY part of the UI, instead whenever "isSaving" is triggered
  // then mutate this list regardless of the filters
  useEffect(() => {
    if (state.isSaving) {
      mutate();
    }
  }, [state.isSaving, mutate]);

  // We need to reset whenever we unmount to keep the rendering times at a good pace
  useEffect(() => {
    return () => {
      cache.clear();
    };
  }, []);

  // We have data! Or not...
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;

  // There's an error on the list, or the list is empty
  if (error) {
    console.error(error);
    return <div>An Error Happened</div>;
  }

  if (isEmpty) {
    return (
      <Square height="80vh">
        <LogoIcon boxSize={8} color="purple.500" mr={2} />
        <Heading size="lg">No Memories</Heading>
      </Square>
    );
  }

  if (data) {
    const allData = data.flat();
    const isReachingEnd =
      isEmpty || (data && data[data.length - 1]?.length < 30);
    return (
      <>
        <HomeHeader
          sortType={sortType}
          onChange={(val) => setSortType(val)}
          view={{ type: viewType, onChange: (val) => setViewType(val) }}
        />
        {viewType === "list" && <DiaryList data={allData} />}
        {viewType === "grid" && <DiaryGrid data={allData} />}
        {!isReachingEnd && (
          <HStack mt={3} mb={10} borderLeftWidth="1px" borderRightWidth="1px">
            <Button
              onClick={() => setSize(size + 1)}
              flex={1}
              variant="ghost"
              py={8}
              isLoading={isLoadingMore}
              loadingText="Loading More"
            >
              <ArrowDownIcon />
              LoadMore
              <ArrowDownIcon />
            </Button>
          </HStack>
        )}
      </>
    );
  }

  return <MdLoader />;
}
