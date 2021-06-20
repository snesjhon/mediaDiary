import {
  Image,
  Heading,
  SimpleGrid,
  Box,
  Divider,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MDB_IMGURL } from "../../../config/contants";
import type { MovieCastEntity, TVCast } from "../../../types/typesMDb";

interface Props {
  cast: MovieCastEntity[] | TVCast[];
}

export default function MediaCast({ cast }: Props): JSX.Element {
  return (
    <>
      <Heading size="lg" mb={5}>
        Cast
      </Heading>
      <SimpleGrid columns={{ base: 2, sm: 4 }} gap={{ base: 10, sm: 4 }}>
        {cast.slice(0, 4).map((e) => (
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
  );
}
