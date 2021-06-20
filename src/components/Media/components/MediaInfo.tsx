import { VStack } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

export default function MediaInfo({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  return (
    <VStack spacing="6" justify="center" align="left">
      {children}
    </VStack>
  );
}
