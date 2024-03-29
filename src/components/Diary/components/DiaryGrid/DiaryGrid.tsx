import { useMDDispatch } from "@/config";
import { StarEmptyIcon } from "@/icons";
import { createPosterURL } from "@/utils";
import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/system";
import dayjs from "dayjs";
import React from "react";
import Rating from "react-rating";
import type { ListState, SortType } from "../../config";

interface Props {
  data: ListState;
  sortType: SortType["type"];
}

export default function DiaryGrid({ data, sortType }: Props): JSX.Element {
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  return (
    <>
      {Object.keys(data).map((month, monthIndex) => {
        return (
          <Grid
            templateColumns={{
              base: "3rem 1fr",
              md: "0.1fr 0.9fr",
            }}
            key={monthIndex}
            borderLeftWidth={{ base: 0, md: "1px" }}
            borderRightWidth={{ base: 0, md: "1px" }}
            px={{ md: 8 }}
          >
            <Box>
              <Text
                fontSize={{ base: "lg", md: "2xl" }}
                color={colorMode === "light" ? "gray.600" : "gray.300"}
                fontWeight="bold"
                position="sticky"
                top="7.5rem"
              >
                {dayjs(`${month}-01`).format("MMM")}
                <Text
                  as="span"
                  display="block"
                  fontSize="sm"
                  color="purple.700"
                >
                  {dayjs(`${month}-01`).format("YYYY")}
                </Text>
              </Text>
            </Box>
            <Grid
              gridTemplateColumns={{
                base: "1fr 1fr",
                sm: "1fr 1fr 1fr",
                md: "repeat(4, 1fr)",
              }}
              gridRowGap="6"
              borderBottomWidth="1px"
              mb="6"
            >
              {Object.keys(data[month]).map((day, dayIndex) => {
                const { rating, title, poster, type } = data[month][day];
                const diaryDate = data[month][day][sortType];
                return (
                  <Grid
                    gridTemplateRows={{
                      base: "2rem 4rem 1fr",
                      xs: "1rem 1fr auto",
                    }}
                    alignItems="flex-end"
                    gridGap="0.5rem"
                    px={3}
                    py={{ base: 4, md: 5 }}
                    key={monthIndex + dayIndex}
                    _hover={{
                      bg: colorMode === "light" ? "purple.50" : "gray.700",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      dispatch({
                        type: "day",
                        payload: data[month][day],
                      })
                    }
                  >
                    <Box textAlign="center">
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color={colorMode === "light" ? "gray.500" : "gray.300"}
                      >
                        {diaryDate
                          ? new Date(diaryDate).toLocaleDateString("en-us", {
                              day: "numeric",
                            })
                          : "No Date"}
                      </Text>
                    </Box>
                    <Box>
                      <Image
                        src={createPosterURL(poster, type)}
                        ignoreFallback
                        borderRadius="5px"
                        border="1px solid"
                        borderColor="gray.300"
                      />
                    </Box>
                    <Flex flexDirection="column" overflow="hidden">
                      <Text mb="1" isTruncated>
                        {title}
                      </Text>
                      <Flex
                        mt="auto"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box mt={type === "tv" ? "-3px" : undefined}>
                          {rating === 0 ? (
                            <Text fontSize="sm" color="gray.500">
                              No Rating
                            </Text>
                          ) : (
                            <Rating
                              fractions={2}
                              readonly
                              initialRating={rating}
                              fullSymbol={
                                <StarIcon
                                  h={{ base: "12px", md: "15px" }}
                                  w={{ base: "12px", md: "15px" }}
                                  color="purple.400"
                                />
                              }
                              emptySymbol={
                                <StarEmptyIcon
                                  h={{ base: "12px", md: "15px" }}
                                  w={{ base: "12px", md: "15px" }}
                                  stroke="purple.400"
                                />
                              }
                            />
                          )}
                        </Box>
                      </Flex>
                    </Flex>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
