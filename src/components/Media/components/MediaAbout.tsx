import { Heading, Text } from "@chakra-ui/layout";
import React from "react";

interface Props {
  tagline: string;
  overview: string;
}
export default function MediaAbout({ tagline, overview }: Props): JSX.Element {
  return (
    <>
      <Heading size="lg" mb={3}>
        About
      </Heading>
      <Text
        textTransform="uppercase"
        pb={2}
        fontSize="sm"
        fontWeight={400}
        color="gray.500"
      >
        {tagline}
      </Text>
      <Text>{overview}</Text>
    </>
  );
}
