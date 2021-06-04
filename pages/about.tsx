import { Box, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../src/components/layouts/Layout";
import LayoutFooter from "../src/components/layouts/LayoutFooter";
import LayoutHeader from "../src/components/layouts/LayoutHeader";

export default function AboutPage(): JSX.Element {
  return (
    <Layout>
      <LayoutHeader />
      <Box mt={20}>
        <Heading size="lg">About mediaDiary</Heading>
        <Box as="hr" my="2" />
        <Text>lorem</Text>
        <Spacer py="6" />
        <Heading size="lg">Why was mediaDiary created?</Heading>
        <Box as="hr" my="2" />
        <Text>lorem</Text>
      </Box>
      <LayoutFooter />
    </Layout>
  );
}
