/* eslint-disable react/display-name */
import { MdLoader } from "@/md";
import { ContentDrawer } from "@/src/components/Content/components";
import { ChakraProvider } from "@chakra-ui/react";
import { createMount } from "@shopify/react-testing";
import React, { Suspense } from "react";

export const mountWithContext = createMount({
  context: (options) => options,
  render: (element) => <ChakraProvider resetCSS>{element}</ChakraProvider>,
});

export const mountWithDrawerSuspense = createMount({
  context: (options) => options,
  render: (element) => (
    <ChakraProvider>
      <ContentDrawer isOpen={true} placement="right">
        <Suspense fallback={<MdLoader />}>{element}</Suspense>
      </ContentDrawer>
    </ChakraProvider>
  ),
});
