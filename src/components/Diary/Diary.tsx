import { useMDState } from "@/config";
import { LogoIcon } from "@/icons";
import { MdLoader } from "@/md";
import type {
  ListState,
  MediaDiaryWithId,
  SortType,
  UserFuegoValidated,
  ViewType,
} from "@/types";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { Button, Heading, HStack, Square } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { cache, useSWRInfinite } from "swr";
import { DiaryGrid, DiaryHeader, DiaryList } from "./components";
import { fuegoDiaryGet } from "./config";

export default function Diary({
  user,
}: {
  user: UserFuegoValidated;
}): JSX.Element {
  const state = useMDState();
  const [sortType, setSortType] = useState<SortType>({
    type: "diaryDate",
    sort: "desc",
  });
  const [viewType, setViewType] = useState<ViewType>("list");

  const { data, error, size, setSize, mutate } = useSWRInfinite<
    MediaDiaryWithId[]
  >(
    (_, prev) => {
      // We've reached the end of the list since we got < 30, don't call again
      if (prev && prev.length < 30) return null;

      return [
        "/fuego/diary",
        user.uid,
        prev !== null ? prev[prev.length - 1][sortType.type] : null,
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
    const diaryDates: ListState = allData.reduce<ListState>((a, c) => {
      if (c.diaryDate && sortType.type === "diaryDate") {
        const dateString = dayjs(c.diaryDate).format("YYYY-MM");
        a[dateString] = Object.assign({ ...a[dateString] }, { [c.id]: c });
      }
      if (c.addedDate && sortType.type === "addedDate") {
        const dateString = dayjs(c.addedDate).format("YYYY-MM");
        a[dateString] = Object.assign({ ...a[dateString] }, { [c.id]: c });
      }
      return a;
    }, {});
    const isReachingEnd =
      isEmpty || (data && data[data.length - 1]?.length < 30);
    return (
      <>
        <DiaryHeader
          sortType={sortType}
          onChange={(val) => setSortType(val)}
          view={{ options: viewType, onChange: (val) => setViewType(val) }}
        />
        {viewType === "list" && (
          <DiaryList data={diaryDates} sortType={sortType.type} />
        )}
        {viewType === "grid" && (
          <DiaryGrid data={diaryDates} sortType={sortType.type} />
        )}
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
