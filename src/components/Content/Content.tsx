import { MdLayout, MdLoader } from "@/md";
import { Box, Grid, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { Router } from "next/router";
import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import {
  Day,
  DayRating,
  Edit,
  EditRating,
  Log,
  LogRating,
  Search,
  Selected,
} from "..";
import { useMDState } from "../../config/store";
import useIsBreakpoint from "../../utils/useIsBreakpoint";
import { ContentDrawer, ContentSidebar, ContentToolbar } from "./components";

export default function Content({
  children,
  title = "MediaDiary",
}: PropsWithChildren<unknown> & { title: string }): JSX.Element {
  const { view } = useMDState();
  const isMd = useIsBreakpoint("md");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  // route transition - in order to prevent bad UX because of SSR props
  // https://stackoverflow.com/questions/60755316/nextjs-getserversideprops-show-loading
  useEffect(() => {
    const start = () => {
      if (!isMd) {
        onClose();
      }
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
  }, [isMd, onClose]);

  return (
    <MdLayout>
      <Head>
        <title>{title} / MediaDiary</title>
      </Head>
      <ContentToolbar onOpen={onOpen} />
      <Grid mt={12} gridTemplateColumns={{ base: "1fr", md: "0.2fr 1fr" }}>
        <ContentSidebar isOpen={isOpen} onClose={onClose} />
        <Box>{loading ? <MdLoader /> : children}</Box>
      </Grid>
      {!loading && (
        <>
          <ContentDrawer
            isOpen={
              view === "log" ||
              view === "edit" ||
              view === "editRating" ||
              view === "selected" ||
              view === "day" ||
              view === "dayRating" ||
              view === "logRating"
            }
            placement="right"
            showHeader={view === "day" || view === "dayRating" ? false : true}
          >
            {view === "selected" && <Selected />}
            {view === "day" && <Day />}
            {view === "dayRating" && <DayRating />}
            {view === "log" && <Log />}
            {view === "logRating" && <LogRating />}
            {view === "edit" && <Edit />}
            {view === "editRating" && <EditRating />}
          </ContentDrawer>
          <Search />
        </>
      )}
    </MdLayout>
  );
}
