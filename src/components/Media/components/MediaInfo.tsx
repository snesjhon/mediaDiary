import { Divider, Grid, Heading } from "@chakra-ui/react";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";

export default function MediaInfo({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element {
  return (
    <>
      <Heading size="lg" mb="4" mt="6">
        Info
      </Heading>
      <Grid
        gridTemplateColumns={{
          base: "repeat(auto-fill, minmax(100px, 1fr))",
          sm: "repeat(auto-fill, minmax(150px, 1fr))",
          md: "repeat(auto-fill, minmax(200px, 1fr))",
        }}
        gridGap={{ base: "5", sm: "10" }}
      >
        {children}
      </Grid>
      <Divider mt={4} mb="6" />
    </>
  );
}
