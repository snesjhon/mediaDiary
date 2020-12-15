import { Box, Grid } from "@chakra-ui/react";
import { Router } from "next/router";
import type { PropsWithChildren } from "react";
import React from "react";
import useIsBreakpoint from "../../hooks/useIsBreakpoint";
import Content from "../Content";
import Header from "../Header";
import MdLoader from "../md/MdLoader";
import SidebarDesktop from "../sidebar/SidebarDesktop";
import Layout from "./Layout";

function LayoutMain({ children }: PropsWithChildren<unknown>): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const [loading, setLoading] = React.useState(false);
  // route transition - in order to prevent bad UX because of SSR props
  // https://stackoverflow.com/questions/60755316/nextjs-getserversideprops-show-loading
  React.useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <Layout>
      <Header />
      <Grid mt={12} gridTemplateColumns={{ base: "1fr", md: "0.2fr 1fr" }}>
        {isMd && <SidebarDesktop />}
        <Box>{loading ? <MdLoader /> : children}</Box>
      </Grid>
      <Content />
    </Layout>
  );
}

export default LayoutMain;
