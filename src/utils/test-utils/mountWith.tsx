/* eslint-disable react/display-name */
import { ChakraProvider } from "@chakra-ui/react";
import "@shopify/react-testing/matchers";
import { createMount } from "@shopify/react-testing";
import React, { Suspense } from "react";
import { ContentDrawer } from "../../components/Content/components";
import MdLoader from "../../components/md/MdLoader";

import {
  ContextDispatch,
  ContextState,
  Reducer,
} from "../../../src/config/store";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

export const mountWithContext = createMount({
  context: (options) => options,
  render: (element) => <ChakraProvider resetCSS>{element}</ChakraProvider>,
});

export const mountWithDrawerSuspense = createMount({
  context: (options) => options,
  render: (element) => (
    // <ContextState.Provider
    //   value={{
    //     preference: null,
    //     view: "md",
    //     diaryFilters: null,
    //     bookmarkFilters: null,
    //   }}
    // >
    //   <ContextDispatch.Provider value={() => null}>
    <ChakraProvider>
      <ContentDrawer isOpen={true} placement="right">
        <Suspense fallback={<MdLoader />}>{element}</Suspense>
      </ContentDrawer>
    </ChakraProvider>
    //   </ContextDispatch.Provider>
    // </ContextState.Provider>
  ),
});