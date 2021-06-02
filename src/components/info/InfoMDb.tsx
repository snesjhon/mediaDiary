import {
  Box,
  Divider,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
  Link,
} from "@chakra-ui/react";
import React from "react";
import { MDB_IMGURL } from "../../config/contants";
import type { MDbMovie, MDbTV } from "../../types/typesMDb";
import type { MediaType } from "../../types/typesMedia";

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
            <SimpleGrid columns={{ base: 2, sm: 4 }} gap={{ base: 10, sm: 4 }}>
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
                    <Image src={`${MDB_IMGURL}w200${e.profile_path}`} />
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
            <Divider mt={4} mb={4} />
          </>
        )}
        {castMovie && (
          <>
            <Heading size="lg" mb={5}>
              Where to Watch
            </Heading>
            <WatchProvider movie={castMovie} />
          </>
        )}
      </>
    </Box>
  );
}

function WatchProvider({ movie }: { movie: MDbMovie }) {
  const movieFlatRate = movie["watch/providers"]?.results["US"]?.flatrate;
  // const hasProviders = typeof movieProvider?.flatrate !== "undefined" && movieProvider?.flatrate !== null;
  if (typeof movieFlatRate !== "undefined" && movieFlatRate !== null) {
    return (
      <div>
        <Heading size="md" fontWeight="normal">
          Stream
        </Heading>
        <Flex mt={3}>
          {movieFlatRate.length > 0 &&
            movieFlatRate.map((e) => (
              <Link
                key={e.provider_name + e.provider_id}
                target="_blank"
                href={movie["watch/providers"].results["US"].link}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w200${e.logo_path}`}
                  w={10}
                  mr={8}
                />
              </Link>
            ))}
        </Flex>
      </div>
    );
  }
  return null;
}

export default ContentMDb;
