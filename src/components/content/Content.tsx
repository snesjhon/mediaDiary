import {
  Box,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { Router } from "next/router";
import type { PropsWithChildren } from "react";
import React, { useEffect, useRef } from "react";
import { useMDDispatch, useMDState } from "../../config/store";
import useIsBreakpoint from "../../utils/useIsBreakpoint";
import Layout from "../layouts/Layout";
import LayoutDrawer from "../layouts/LayoutDrawer";
import MdLoader from "../md/MdLoader";
import MdLogo from "../md/MdLogo";
import Sidebar from "../sidebar/Sidebar";
import SidebarDesktop from "../sidebar/SidebarDesktop";
import ContentEdit from "./ContentEdit";
import ContentLog from "./ContentLog";
import ContentSearch from "./ContentSearch";
import ContentSelected from "./ContentSelected";
import ContentToolbar from "./ContentToolbar";
import ContentWithId from "./ContentWithId";

function Content({
  children,
  title = "MediaDiary",
}: PropsWithChildren<unknown> & { title: string }): JSX.Element {
  const { view } = useMDState();
  const dispatch = useMDDispatch();
  const isMd = useIsBreakpoint("md");
  const refInput = useRef<HTMLInputElement>(null);
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
    <Layout>
      <Head>
        <title>{title} / MediaDiary</title>
      </Head>
      <ContentToolbar onOpen={onOpen} />
      <Grid mt={12} gridTemplateColumns={{ base: "1fr", md: "0.2fr 1fr" }}>
        {isMd ? (
          <SidebarDesktop />
        ) : (
          <Sidebar isOpen={isOpen} onClose={onClose} />
        )}
        <Box>{loading ? <MdLoader /> : children}</Box>
      </Grid>
      {!loading && (
        <>
          <LayoutDrawer
            isOpen={
              view === "log" ||
              view === "edit" ||
              view === "selected" ||
              view === "selectedWithId"
            }
            placement="right"
          >
            {view === "selected" && <ContentSelected />}
            {view === "selectedWithId" && <ContentWithId />}
            {view === "log" && <ContentLog />}
            {view === "edit" && <ContentEdit />}
          </LayoutDrawer>
          <Modal
            isOpen={view === "search"}
            onClose={() => dispatch({ type: "dayClose" })}
            scrollBehavior="inside"
            size={isMd ? "xl" : "sm"}
            initialFocusRef={refInput}
          >
            <ModalOverlay sx={{ zIndex: 2 }}>
              <ModalContent maxHeight="50vh" my={{ base: 2, sm: "3.75rem" }}>
                <ModalCloseButton />
                <ModalHeader>
                  <MdLogo title="Search" />
                </ModalHeader>
                <ModalBody pt={0} pb={6}>
                  {view === "search" && <ContentSearch refInput={refInput} />}
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export default Content;
