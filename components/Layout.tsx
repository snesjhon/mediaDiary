import React, { PropsWithChildren } from "react";
import { Box, Container } from "@chakra-ui/core";

function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <Container maxWidth={{ base: "xl", md: "lg" }}>
      <Box pt={3} mt={16} mx="auto">
        {children}
      </Box>
    </Container>
  );
}

export default Layout;
