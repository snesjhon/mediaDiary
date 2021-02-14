import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  Image,
} from "@chakra-ui/react";
import React from "react";
import type { MediaType } from "../../config/types";
import type { MDbMovie, MDbTV } from "../../config/typesMDb";

function ContentMDb({
  data,
  type,
}: {
  data: MDbMovie | MDbTV;
  type: MediaType;
}): JSX.Element {
  // Cast to assure we have a movie and get the proper types
  const castMovie = type === "movie" && (data as MDbMovie);
  return (
    <Box my={4}>
      <>
        {typeof data.overview !== "undefined" && data.overview && (
          <>
            <Heading size="lg" mb={3}>
              About
            </Heading>
            {castMovie && typeof castMovie.tagline !== "undefined" && (
              <Text
                textTransform="uppercase"
                pb={2}
                fontSize="sm"
                fontWeight={400}
                color="gray.500"
              >
                {castMovie.tagline}
              </Text>
            )}
            <Text>{data.overview}</Text>
            <Divider mt={4} mb={4} />
          </>
        )}
        {data.credits && data.credits.cast && (
          <>
            <Heading size="lg" mb={5}>
              Cast
            </Heading>
            <SimpleGrid columns={4} gap={4}>
              {data.credits.cast.slice(0, 4).map((e) => (
                <Box
                  maxW="sm"
                  boxShadow="md"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  as="a"
                  href={`https://www.themoviedb.org/person/${e.id}`}
                  target="_blank"
                  key={e.name}
                >
                  {e.profile_path !== null && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${e.profile_path}`}
                    />
                  )}
                  <Box px={3} py={3}>
                    <Text fontWeight="bold" isTruncated>
                      {e.name}
                    </Text>
                    {e.character && <Text>{e.character}</Text>}
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </>
        )}
      </>
    </Box>
  );
}
export default ContentMDb;
