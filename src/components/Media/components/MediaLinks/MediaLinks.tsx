import { Flex } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

export default function MediaLinks({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  return (
    <Flex gridGap="2" py="4">
      {children}
    </Flex>
  );
}
