import { Flex, Grid, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Day from "../components/Day";
import Header from "../components/Header";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import { useMDState } from "../config/store";
import { useAuth } from "../utils/auth";

function Home(): JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const { view } = useMDState();
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
          {(view === "search" || view === "log") && <Search />}
          {!!router.query.day && <Day diaryId={router.query.day.toString()} />}
        </>
      )}
    </Layout>
  );
}

export default Home;
