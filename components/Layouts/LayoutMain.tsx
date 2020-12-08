import { Box, Grid } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { useIsBreakpoint } from "../../utils/helpers";
import Content from "../Content";
import Header from "../Header";
import Layout from "../Layout";
import SidebarDesktop from "../SidebarDesktop";

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
