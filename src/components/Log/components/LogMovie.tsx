import { ExternalLinkIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Dispatch } from "react";
import React from "react";
import Rating from "react-rating";
import { MEDIA_LOGGED_BEFORE } from "../../../config/contants";
import type { LogActions, LogState } from "../../../config/storeLog";
import type { MDbMovie } from "../../../types/typesMDb";
import { createPosterURL, parsePosterUrl } from "../../../utils/helpers";
import StarEmptyIcon from "../../icons/StartEmptyIcon";

interface Props {
  data: MDbMovie;
  dispatch: Dispatch<LogActions>;
  fields: LogState;
}

export default function LogMovie({
  data,
  dispatch,
  fields,
}: Props): JSX.Element {
  const { credits, genres, title, poster_path, release_date, homepage } = data;
  const { diaryDate, loggedBefore, rating } = fields;

  const whereToWatch = data["watch/providers"]?.results["US"]?.link;

  const artist =
    credits &&
    credits.crew &&
    credits.crew.find((e) => e.job === "Director")?.name;

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
        gridTemplateColumns="1fr 1fr"
        gridGap="1.5rem"
        justifyContent="center"
        my={6}
      >
        <Box ml={{ base: 0, sm: 12 }}>
          <Image
            src={createPosterURL(parsePosterUrl(poster_path, "movie"), "movie")}
            borderRadius="5px"
            border="1px solid"
            borderColor="gray.300"
            loading="eager"
          />
        </Box>
        <VStack spacing="6" justify="center" align="left">
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Released
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {typeof release_date !== "undefined" &&
                `${new Date(release_date).toLocaleDateString("en-us", {
                  year: "numeric",
                })}`}
            </Text>
          </Box>
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Genre
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {genres && genres[0].name}
            </Text>
          </Box>
          {whereToWatch && (
            <Box>
              <Button
                as={Link}
                href={data["watch/providers"].results["US"].link}
                target="_blank"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
              >
                Where to Watch
              </Button>
            </Box>
          )}
          {homepage && (
            <Box>
              <Button
                as={Link}
                href={homepage}
                target="_blank"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
              >
                HomePage
              </Button>
            </Box>
          )}
        </VStack>
      </Grid>
      <Divider mt={4} mb={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Date</Text>
        <Box>
          <Input
            size="sm"
            type="date"
            required
            value={dayjs(diaryDate).format("YYYY-MM-DD")}
            max={dayjs().format("YYYY-MM-DD")}
            onChange={(e) =>
              dispatch({
                type: "state",
                payload: {
                  key: "diaryDate",
                  value: dayjs(e.target.value).toISOString(),
                },
              })
            }
          />
        </Box>
      </Flex>
      <Divider my={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Rate</Text>
        <Box mt="-4px">
          <Rating
            fractions={2}
            initialRating={rating}
            fullSymbol={<StarIcon h="20px" w="20px" color="purple.500" />}
            emptySymbol={
              <StarEmptyIcon h="20px" w="20px" stroke="purple.500" />
            }
            onChange={(value) =>
              dispatch({
                type: "state",
                payload: {
                  key: "rating",
                  value,
                },
              })
            }
          />
        </Box>
      </Flex>
      <Divider my={2} />
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{MEDIA_LOGGED_BEFORE["movie"]}</Text>
        <Checkbox
          colorScheme="purple"
          isChecked={loggedBefore}
          onChange={() =>
            dispatch({
              type: "state",
              payload: { key: "loggedBefore", value: !loggedBefore },
            })
          }
        />
      </Flex>
    </>
  );
}
