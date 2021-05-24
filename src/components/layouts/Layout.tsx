import React from "react";
import type { PropsWithChildren } from "react";
import { Box, Container } from "@chakra-ui/react";

function Layout({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Container maxWidth={{ md: "container.lg" }}>
      <Box mx="auto">{children}</Box>
    </Container>
  );
}

export default Layout;
