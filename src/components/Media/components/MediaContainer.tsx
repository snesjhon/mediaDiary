import { Box, Grid } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

export default function MediaContainer({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  return <Box my={6}>{children}</Box>;
}
