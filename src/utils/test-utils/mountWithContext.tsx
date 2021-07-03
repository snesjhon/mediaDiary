/* eslint-disable react/display-name */
import { ChakraProvider } from "@chakra-ui/react";
import "@shopify/react-testing/matchers";
import { createMount } from "@shopify/react-testing";
import React from "react";

const mountWithContext = createMount({
  context: (options) => options,
  render: (element) => <ChakraProvider resetCSS>{element}</ChakraProvider>,
});

export default mountWithContext;
