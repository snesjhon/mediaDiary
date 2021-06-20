import { Text, Flex, Heading } from "@chakra-ui/react";
import React from "react";

export default function MediaHeader({
  artist,
  title,
}: {
  artist: string | null | undefined;
  title: string;
}): JSX.Element {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
    >
      {artist && <Text fontSize="lg">{artist}</Text>}
      <Heading fontWeight="bold" fontStyle="italic" size="lg" lineHeight={1.3}>
        {title}
      </Heading>
    </Flex>
  );
}
