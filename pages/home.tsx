import { Flex, Grid, Spinner } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect } from "react";
import LogoIcon from "../components/Icons/LogoIcon";
import Layout from "../components/Layouts/Layout";
import LayoutMain from "../components/Layouts/LayoutMain";
import MediaDiary from "../components/MediaDiary";
import { useMDDispatch, useMDState } from "../config/store";
import { useAuth } from "../utils/auth";
import nookies from "nookies";

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  props: {
    token: unknown;
  };
}> => {
  let token;
  const cookies = nookies.get(context);
  if (cookies.spotifyToken) {
    token = cookies.refreshToken;
  } else {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_SECRET;

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

    const spotifyResponse = await res.json();
    token = spotifyResponse.access_token;
    nookies.set(context, "refreshToken", token, {
      maxAge: 3600,
    });
  }

  return {
    props: {
      token,
    },
  };
};

function Home({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { user } = useAuth();
  const { spotifyToken } = useMDState();
  const dispatch = useMDDispatch();

  useEffect(() => {
    if (!spotifyToken && token) {
      dispatch({
        type: "state",
        payload: { key: "spotifyToken", value: token },
      });
    }
  }, [dispatch, spotifyToken, token]);

  return !user ? (
    <Layout>
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
    </Layout>
  ) : (
    <LayoutMain>
      <MediaDiary />
    </LayoutMain>
  );
}

export default Home;
