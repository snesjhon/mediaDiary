import type { MediaDiaryWithId } from "@/types";
import { createPosterURL, parsePosterUrl } from "@/utils";
import { Box, Grid, Image, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  data: MediaDiaryWithId[];
}
export default function SearchMedia({ data }: Props): JSX.Element {
  return (
    <Grid gridTemplateColumns="repeat(5, 1fr)">
      {data.map((item, i) => (
        <Box key={item.title + i}>
          <Image
            src={createPosterURL(
              parsePosterUrl(item.poster, item.type),
              item.type
            )}
            borderRadius="5px"
            border="1px solid"
            borderColor="gray.300"
            loading="eager"
          />
          <Text>{item.title}</Text>
          {item.artist && <Text>{item.artist}</Text>}
        </Box>
      ))}
    </Grid>
  );
}
