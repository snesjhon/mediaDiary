import { Box, Flex, Grid, Spinner } from "@chakra-ui/react";
import React from "react";
import Day from "../components/Day";
import Header from "../components/Header";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import Log from "../components/Log";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import SidebarDesktop from "../components/SidebarDesktop";
import { useAuth } from "../utils/auth";

function Home(): JSX.Element {
  const { user } = useAuth();
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
          <Grid gridTemplateColumns="0.2fr 1fr">
            <SidebarDesktop />
            <Box id="mediaDiary">
              <MediaDiary />
            </Box>
          </Grid>
          <Search />
          <Log />
          <Day />
        </>
      )}
    </Layout>
  );
}

export default Home;
