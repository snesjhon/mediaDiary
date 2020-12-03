import { Box, Flex, Grid, Spinner } from "@chakra-ui/react";
import { InferGetStaticPropsType } from "next";
import React, { useReducer } from "react";
import Day from "../components/Day";
import Header from "../components/Header";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layout";
import Log from "../components/Log";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import SidebarDesktop from "../components/SidebarDesktop";
import { ContextDispatch, ContextState, Reducer } from "../config/store";
import { useAuth } from "../utils/auth";

interface Tokens {
  access_token: any;
}

export const getStaticProps = async () => {
  const client_id = ""; // Your client id
  const client_secret = ""; // Your secret

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const token: Tokens = await res.json();

  return {
    props: {
      token,
    },
  };
};

function Home({
  token,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(Reducer, {
    page: 1,
    filterBy: ["album", "movie", "tv"],
    spotifyToken: token.access_token,
  });

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
        <ContextState.Provider value={state}>
          <ContextDispatch.Provider value={dispatch}>
            <Header />
            <Grid gridTemplateColumns="0.2fr 1fr">
              <SidebarDesktop />
              <Box id="mediaDiary">
                <MediaDiary />
              </Box>
            </Grid>
            {state.view === "search" && <Search />}
            {state.view === "log" && <Log />}
            {(state.view === "day" || state.view === "edit") && <Day />}
          </ContextDispatch.Provider>
        </ContextState.Provider>
      )}
    </Layout>
  );
}

export default Home;
