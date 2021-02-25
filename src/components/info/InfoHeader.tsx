import { EditIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import Rating from "react-rating";
import { useMDDispatch, useMDState } from "../../config/store";
import type { DiaryAdd, MediaSelected } from "../../types/typesMedia";
import { createPosterURL } from "../../utils/helpers";
import StarEmptyIcon from "../icons/StartEmptyIcon";

interface Props {
  artist: MediaSelected["artist"];
  title: MediaSelected["title"];
  poster: MediaSelected["poster"];
  genre: MediaSelected["genre"];
  releasedDate: MediaSelected["releasedDate"];
  type: MediaSelected["type"];
  diaryDate?: DiaryAdd["diaryDate"];
  rating?: DiaryAdd["rating"];
}

function InfoHeader({
  artist,
  title,
  poster,
  genre,
  releasedDate,
  diaryDate,
  rating,
  type,
}: Props): JSX.Element {
  const dispatch = useMDDispatch();
  const { view } = useMDState();
  const showDiary =
    diaryDate && typeof rating !== "undefined" && view !== "edit";
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Text fontSize="lg">{artist}</Text>
        <Heading
          fontWeight="bold"
          fontStyle="italic"
          size="lg"
          lineHeight={1.3}
        >
          {title}
        </Heading>
      </Flex>
      <Grid
        gridTemplateColumns={
          showDiary ? { base: "0.6fr 0.4fr", md: "1fr 1fr" } : undefined
        }
        gridGap="1.5rem"
        justifyContent="center"
        mt={6}
      >
        <Box ml="auto">
          <Image
            src={createPosterURL(poster, type)}
            w="13rem"
            h={type === "album" ? "13rem" : "20rem"}
            borderRadius="5px"
            border="1px solid"
            borderColor="gray.300"
            loading="eager"
          />
        </Box>
        {showDiary && (
          <Flex flexDirection="column" justifyContent="space-around">
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Date
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                {dayjs(diaryDate).format("MMM D, YYYY")}
              </Text>
            </Box>
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Rating
              </Text>
              <Text fontWeight="bold">
                <Rating
                  fractions={2}
                  readonly
                  initialRating={rating}
                  fullSymbol={<StarIcon color="purple.400" w="20px" h="20px" />}
                  emptySymbol={
                    <StarEmptyIcon stroke="purple.400" w="20px" h="20px" />
                  }
                />
              </Text>
            </Box>
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Edit
              </Text>
              <IconButton
                icon={<EditIcon />}
                aria-label="edit"
                variant="outline"
                size="sm"
                colorScheme="green"
                isRound
                onClick={() => dispatch({ type: "view", payload: "edit" })}
              />
            </Box>
          </Flex>
        )}
      </Grid>
      <Grid
        gridTemplateColumns={showDiary ? "1fr 1fr" : undefined}
        gridGap="1.5rem"
        justifyContent="center"
      >
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.500"
          mt={1}
          ml="auto"
          textTransform="uppercase"
        >
          {genre && <>{genre} • </>}
          {typeof releasedDate !== "undefined" &&
            `${new Date(releasedDate).toLocaleDateString("en-us", {
              year: "numeric",
            })}`}
        </Text>
        <div />
      </Grid>
    </>
  );
}

export default InfoHeader;
