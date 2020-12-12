import { Box, Grid } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import React from "react";
import useIsBreakpoint from "../../utils/useIsBreakpoint";
import Content from "../Content";
import Header from "../Header";
import SidebarDesktop from "../sidebar/SidebarDesktop";
import Layout from "./Layout";

function LayoutMain({ children }: PropsWithChildren<unknown>): JSX.Element {
  const isMd = useIsBreakpoint("md");
  return (
    <Layout>
      <Header />
      <Grid mt={12} gridTemplateColumns={{ base: "1fr", md: "0.2fr 1fr" }}>
        {isMd && <SidebarDesktop />}
        <Box>{children}</Box>
      </Grid>
      <Content />
    </Layout>
  );
}

export default LayoutMain;
