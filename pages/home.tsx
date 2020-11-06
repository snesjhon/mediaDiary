import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  Flex,
  Grid,
  Spinner,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import Day from "../components/Day";
import Header from "../components/Header";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import Log from "../components/Log";
import LogEdit from "../components/LogEdit";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import useUser from "../utils/useUser";

function Home(): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  return (
    <Layout>
      {!user ? (
        <Flex height="90vh" justifyContent="center" alignItems="center">
          <Grid alignItems="center" justifyItems="center">
            <LogoIcon boxSize={8} sx={{ gridRow: 1, gridColumn: 1 }} />
            <Spinner
              size="xl"
              color="purple.500"
              thickness="3px"
              sx={{ gridRow: 1, gridColumn: 1 }}
            />
          </Grid>
        </Flex>
      ) : (
        <>
          <Header />
          <MediaDiary />
          {!!router.query.search && <Search />}
          {!!router.query.log && <Log />}
          {!!router.query.view && router.query.view === "edit" && <LogEdit />}
          <Drawer
            onClose={() => router.push("/home")}
            isOpen={!!router.query.day}
            size="full"
          >
            <DrawerOverlay zIndex={2}>
              <DrawerContent>
                <DrawerHeader>
                  <Flex align="center">
                    <LogoIcon boxSize={5} mr={1} />
                    <Text
                      fontSize={{ base: "md", md: "xl" }}
                      color="purple.700"
                      fontWeight="medium"
                      cursor="pointer"
                    >
                      mediaDiary
                    </Text>
                  </Flex>
                </DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                  {!!router.query.day && (
                    <Day diaryId={router.query.day.toString()} />
                  )}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </>
      )}
    </Layout>
  );
}

export default Home;
