import { useMDState } from "@/config";
import { useFuegoUser } from "@/fuego";
import { MdLayout, MdLoader } from "@/md";
import { useIsBreakpoint } from "@/utils";
import useDebounce from "@/utils/useDebounce";
import { Box, Grid, useDisclosure } from "@chakra-ui/react";
import Head from "next/head";
import { Router } from "next/router";
import { useState } from "react";
import type { PropsWithChildren } from "react";
import React, { useEffect } from "react";
import useSWR from "swr";
import { Day, DayRating, Edit, EditRating, Log, LogRating, Selected } from "..";
import { ContentDrawer, ContentSidebar, ContentHeader } from "./components";
import { fuegoDiarySearch } from "./config/fuego";
import SearchMedia from "../SearchMedia";
import type { MediaDiaryWithId } from "@/types";

export default function Content({
  children,
  title = "MediaDiary",
}: PropsWithChildren<unknown> & { title: string }): JSX.Element {
  const { view } = useMDState();
  const { user } = useFuegoUser();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = useState("");
  const isMd = useIsBreakpoint("md");

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

  const bouncedSearch = useDebounce(search, 500);
  const { data, isValidating } = useSWR<MediaDiaryWithId[]>(
    bouncedSearch !== "" && user
      ? [`/fuegoSearch/${bouncedSearch}`, user.uid, bouncedSearch]
      : null,
    fuegoDiarySearch,
    { revalidateOnFocus: false }
  );

  const showLoading = loading || isValidating;
  const showContent = !loading && !isValidating;

  return (
    <MdLayout>
      <Head>
        <title>{title} / MediaDiary</title>
      </Head>
      <ContentHeader
        onOpen={onOpen}
        searchString={search}
        handleSearch={(val) => setSearch(val)}
      />
      <Grid mt={12} gridTemplateColumns={{ base: "1fr", md: "0.2fr 1fr" }}>
        <ContentSidebar isOpen={isOpen} onClose={onClose} />
        <Box>
          {showLoading && <MdLoader />}
          {showContent && (
            <>
              {data && (
                <>
                  {data.length > 0 && <SearchMedia data={data} />}
                  {data.length === 0 && <div>No Data</div>}
                </>
              )}
              {!data && children}
            </>
          )}
        </Box>
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
            showHeader={
              view === "day" || view === "dayRating" || view === "selected"
                ? false
                : true
            }
          >
            {view === "selected" && <Selected />}
            {view === "day" && <Day />}
            {view === "dayRating" && <DayRating />}
            {view === "log" && <Log />}
            {view === "logRating" && <LogRating />}
            {view === "edit" && <Edit />}
            {view === "editRating" && <EditRating />}
          </ContentDrawer>
        </>
      )}
    </MdLayout>
  );
}
