import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Spinner,
  Text,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import Day from "../components/Day";
import LogEdit from "../components/LogEdit";
import Header from "../components/Header";
import Layout from "../components/Layout";
import LayoutModal from "../components/LayoutModal";
import Log from "../components/Log";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import useUser from "../utils/useUser";
import LogoIcon from "../components/Icons/LogoIcon";

function App() {
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
            <DrawerOverlay>
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

export default App;
