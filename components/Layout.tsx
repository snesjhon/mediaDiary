import React, { PropsWithChildren } from "react";
import { Box } from "@chakra-ui/core";
import Header from "./Header";

function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <Box>
      <Header />
      {children}
    </Box>
  );
}

export default Layout;
