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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import Day from "../components/Day";
import Header from "../components/Header";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import Log from "../components/Log";
import LogEdit from "../components/LogEdit";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import { useAuth } from "../utils/auth";

function Home(): JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const refFirstField = useRef(null);
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
          {(!!router.query.day ||
            !!router.query.search ||
            !!router.query.log ||
            !!router.query.edit) && (
            <Drawer
              onClose={() => router.push("/home")}
              isOpen={
                !!router.query.day ||
                !!router.query.search ||
                !!router.query.log ||
                !!router.query.edit
              }
              size="full"
              placement={!router.query.day ? "right" : "bottom"}
              initialFocusRef={refFirstField}
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
                    {!!router.query.search && <Search />}
                    {!!router.query.log && <Log />}
                    {!!router.query.edit && <LogEdit />}
                  </DrawerBody>
                </DrawerContent>
              </DrawerOverlay>
            </Drawer>
          )}
        </>
      )}
    </Layout>
  );
}

export default Home;
