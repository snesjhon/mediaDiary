import React, { PropsWithChildren } from "react";
import { Box, Container } from "@chakra-ui/core";

function Layout({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <Container maxWidth={{ base: "xl", md: "lg" }}>
      <Box mt="3rem" mx="auto">
        {children}
      </Box>
    </Container>
  );
}

export default Layout;
