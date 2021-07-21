import { FiltersIcon, LogoIcon } from "@/icons";
import { MdRating } from "@/md";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Square,
  Text,
  Tooltip,
  useToken,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { cache, useSWRInfinite } from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import type { UserFuegoValidated } from "../../types/typesUser";
import { createPosterURL } from "../../utils/helpers";
import MdLoader from "../md/MdLoader";
import { fuegoMemoriesGet } from "./config";

export type SortType = "addedDate" | "rating";

export default function Memories({
  user,
}: {
  user: UserFuegoValidated;
}): JSX.Element {
  const state = useMDState();
  const dispatch = useMDDispatch();
  const [sortType, setSortType] = useState<SortType>("addedDate");
  const [purple500] = useToken("colors", ["purple.500"]);

  const { data, error, size, setSize, mutate } = useSWRInfinite<
    MediaDiaryWithId[]
  >(
    (_, prev) => {
      // We've reached the end of the list since we got < 30, don't call again
      if (prev && prev.length < 30) return null;

      return [
        "/fuego/memories",
        user.uid,
        prev !== null ? prev[prev.length - 1].id : null,
        sortType,
        null,
        null,
        null,
        null,
        // state.bookmarkFilters?.mediaType ?? null,
        // state.bookmarkFilters?.releasedDecade ?? null,
        // state.bookmarkFilters?.addedDate ?? null,
        // state.bookmarkFilters?.genre ?? null,
      ];
    },
    fuegoMemoriesGet,
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
        <Heading size="lg">No Bookmarks</Heading>
      </Square>
    );
  }

  if (data) {
    const allData = data.flat();
    const isReachingEnd =
      isEmpty || (data && data[data.length - 1]?.length < 30);

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
                Memories
              </Heading>
              <Tooltip
                label={
                  <Text>
                    Memories include rated Media <br />
                    with or without a Diary entry
                  </Text>
                }
              >
                <QuestionOutlineIcon />
              </Tooltip>
            </Flex>
            <Flex maxW="720px" align="center">
              <HStack spacing={{ base: 0, sm: 3 }}>
                <Flex alignItems="baseline">
                  <Text color="gray.500" fontSize="sm">
                    Sorted By
                  </Text>
                  <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm" pr="1">
                      {sortType === "addedDate" && "When Rated"}
                      {sortType === "rating" && "Rating"}
                      <ChevronDownIcon boxSize="6" mb="1" />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => setSortType("addedDate")}>
                        When Rated
                      </MenuItem>
                      <MenuItem onClick={() => setSortType("rating")}>
                        Rating
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
                <IconButton
                  icon={<FiltersIcon />}
                  aria-label="filter"
                  size="sm"
                  variant="outline"
                />
              </HStack>
            </Flex>
          </Flex>
        </Box>
        <Grid
          gridTemplateColumns="repeat(5, 1fr)"
          gridGap="2"
          alignItems="flex-end"
          borderLeftWidth={{ base: 0, md: "1px" }}
          borderRightWidth={{ base: 0, md: "1px" }}
          py={{ base: 5, md: 8 }}
          px={{ md: 8 }}
        >
          {allData.map((e, i) => (
            <Grid
              key={e.title + i}
              gridTemplateRows="1fr 2rem"
              onClick={() =>
                dispatch({
                  type: e.diaryDate ? "day" : "dayRating",
                  payload: e,
                })
              }
              mb="2"
            >
              <Image
                src={createPosterURL(e.poster, e.type)}
                ignoreFallback
                borderRadius="5px"
                border="1px solid"
                borderColor="gray.300"
                _hover={{
                  boxShadow: `0 0 0 2px ${purple500}`,
                  border: `1px solid ${purple500}`,
                  cursor: "pointer",
                }}
              />
              <Flex justifyContent="space-between" alignItems="center">
                <MdRating initialRating={e.rating} wh="3" />
                <Text
                  as="span"
                  display="block"
                  fontSize="sm"
                  color="purple.700"
                >
                  {dayjs(e.addedDate).format("MMM D")}
                </Text>
              </Flex>
            </Grid>
          ))}
        </Grid>
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
      </Box>
    );
  }
  return <MdLoader />;
}
