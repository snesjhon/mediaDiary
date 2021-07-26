import { useMDDispatch } from "@/config/store";
import { StarEmptyIcon } from "@/icons";
import type { MediaDiaryWithId, MediaType } from "@/types";
import { capFormat, createPosterURL } from "@/utils/helpers";
import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Grid,
  Image,
  SimpleGrid,
  Text,
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import Rating from "react-rating";

export default function VizHighestRated({
  list,
  mediaType,
}: {
  list: MediaDiaryWithId[];
  mediaType: MediaType | null;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const [purple700] = useToken("colors", ["purple.700"]);
  const { colorMode } = useColorMode();
  return (
    <Box my="8">
      <Box mb="2">
        <Text fontSize="xl" color="gray.500">
          Highest
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          Rated{" "}
          {mediaType
            ? capFormat(mediaType, {
                allCaps: mediaType === "tv",
                isPlural: mediaType === "tv" ? false : true,
              })
            : "Memories"}
        </Text>
      </Box>
      <Box
        bg={colorMode === "light" ? "gray.50" : "gray.700"}
        p={{ base: 0, sm: "8" }}
      >
        <SimpleGrid
          columns={{ base: 3, sm: 3, md: 4 }}
          gap={{ base: 6, sm: 12, md: 12 }}
        >
          {list.map((e) => (
            <Grid
              key={e.addedDate + e.mediaId}
              gridTemplateRows="1fr 2rem 1.5rem"
              alignItems="flex-end"
            >
              <Image
                src={createPosterURL(e.poster, e.type)}
                borderRadius="5px"
                border="1px solid"
                borderColor="gray.300"
                onClick={() =>
                  dispatch({
                    type: "day",
                    payload: e,
                  })
                }
                _hover={{
                  boxShadow: `3px 3px 1px ${purple700}`,
                  borderColor: "purple.500",
                  cursor: "pointer",
                }}
              />
              <Text isTruncated fontSize="sm">
                {e.title}
              </Text>
              <Rating
                fractions={2}
                readonly
                initialRating={e.rating}
                fullSymbol={
                  <StarIcon
                    color="purple.400"
                    w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                    h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                  />
                }
                emptySymbol={
                  <StarEmptyIcon
                    stroke="purple.400"
                    w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                    h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                  />
                }
              />
            </Grid>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
