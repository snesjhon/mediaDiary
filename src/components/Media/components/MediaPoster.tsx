import type { MediaType } from "@/types";
import { createPosterURL, parsePosterUrl } from "@/utils";
import { Box, Image } from "@chakra-ui/react";
import React from "react";

export default function mediaPoster({
  poster,
  type,
}: {
  poster: string;
  type: MediaType;
}): JSX.Element {
  return (
    <Box maxW={{ base: "48", sm: "2xs" }} mx="auto">
      <Image
        src={
          type === "album"
            ? poster
            : createPosterURL(parsePosterUrl(poster, "movie"), "movie")
        }
        borderRadius="5px"
        border="1px solid"
        borderColor="gray.300"
        loading="eager"
      />
    </Box>
  );
}
