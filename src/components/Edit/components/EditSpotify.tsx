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
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import type { Dispatch } from "react";
import React from "react";
import Rating from "react-rating";
import { MEDIA_LOGGED_BEFORE } from "../../../config/contants";
import type { LogActions, LogState } from "../../../config/storeLog";
import type { SpotifyAlbum, SpotifyArtist } from "../../../types/typesSpotify";
import StarEmptyIcon from "../../icons/StartEmptyIcon";

interface Props {
  artist: SpotifyArtist;
  album: SpotifyAlbum;
  dispatch: Dispatch<LogActions>;
  fields: LogState;
}

export default function EditSpotify({
  artist,
  album,
  dispatch,
  fields,
}: Props): JSX.Element {
  const { name: title, images, release_date, label } = album;
  const { name: artistName, genres } = artist;
  const { diaryDate, loggedBefore, rating } = fields;

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Text fontSize="lg">{artistName}</Text>
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
          {images && images?.length > 0 && (
            <Image
              src={images[0].url}
              borderRadius="5px"
              border="1px solid"
              borderColor="gray.300"
              loading="eager"
            />
          )}
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
              {genres && genres[0]}
            </Text>
          </Box>
          <Box>
            <Text fontWeight={500} fontSize="sm">
              Label
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {label}
            </Text>
          </Box>
          <Flex
            justify="space-between"
            direction={{ sm: "column", md: "initial" }}
          >
            <Button
              as="a"
              href={artist.external_urls.spotify}
              target="_blank"
              size="sm"
              rightIcon={<ExternalLinkIcon />}
            >
              Artist Page
            </Button>
            <Button
              href={album.external_urls.spotify}
              as="a"
              target="_blank"
              size="sm"
              rightIcon={<ExternalLinkIcon />}
            >
              Album Page
            </Button>
          </Flex>
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
