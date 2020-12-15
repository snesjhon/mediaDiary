import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { parseCookies } from "nookies";
import React, { useEffect } from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import MediaDiary from "../src/components/MediaDiary";
import { getFuegoToken, getRefreshToken } from "../src/config/getSSRProps";
import { useMDDispatch, useMDState } from "../src/config/store";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = parseCookies(context);
    const refreshToken = await getRefreshToken(cookies, context);
    const fuegoToken = await getFuegoToken(cookies);
    return {
      props: {
        refreshToken,
        fuegoToken,
      },
    };
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};

function Home({
  fuegoToken,
  refreshToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const { spotifyToken } = useMDState();
  const dispatch = useMDDispatch();

  useEffect(() => {
    if (!spotifyToken && refreshToken) {
      dispatch({
        type: "state",
        payload: { key: "spotifyToken", value: refreshToken },
      });
    }
  }, [dispatch, spotifyToken, refreshToken]);

  return !fuegoToken || !spotifyToken ? (
    <MdLoader />
  ) : (
    <LayoutMain>
      <MediaDiary />
    </LayoutMain>
  );
}

export default Home;
