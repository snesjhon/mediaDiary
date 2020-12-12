import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import nookies from "nookies";
import React, { useEffect } from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import MediaDiary from "../src/components/MediaDiary";
import { useAuth } from "../src/config/auth";
import { useMDDispatch, useMDState } from "../src/config/store";

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
    <MdLoader />
  ) : (
    <LayoutMain>
      <MediaDiary />
    </LayoutMain>
  );
}

export default Home;
