import { Grid } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

export default function MediaContainer({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap="1.5rem"
      justifyContent="center"
      my={6}
    >
      {children}
    </Grid>
  );
}
