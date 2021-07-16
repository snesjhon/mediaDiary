import { MdLayout, MdHeader, MdFooter } from "@/md";
import { Box, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";

export default function AboutPage(): JSX.Element {
  return (
    <MdLayout>
      <MdHeader />
      <Box mt={20}>
        <Heading size="lg">About mediaDiary</Heading>
        <Box as="hr" my="2" />
        <Text>lorem</Text>
        <Spacer py="6" />
        <Heading size="lg">Why was mediaDiary created?</Heading>
        <Box as="hr" my="2" />
        <Text>lorem</Text>
      </Box>
      <MdFooter />
    </MdLayout>
  );
}
