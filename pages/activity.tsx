import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Charts from "../src/components/Charts";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import getSpotifyToken from "../src/config/getSpotifyToken";
import { useMDDispatch, useMDState } from "../src/config/store";
import useFuegoUser from "../src/hooks/useFuegoUser";

function Activity(): JSX.Element {
  const { user } = useFuegoUser();
  const { spotifyToken, spotifyTimeOut } = useMDState();
  const dispatch = useMDDispatch();
  const router = useRouter();

  useEffect(() => {
    const now = dayjs();
    if (user) {
      if (!spotifyToken || !spotifyTimeOut || now.isAfter(spotifyTimeOut)) {
        const newTimeout = now.add(1, "hour");
        getSpotifyToken().then((response) => {
          dispatch({
            type: "spotifyToken",
            payload: {
              spotifyToken: response,
              spotifyTimeOut: newTimeout,
            },
          });
        });
      }
    }
  }, [dispatch, spotifyToken, spotifyTimeOut, user]);

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return <MdLoader />;
  }

  return user === null || !spotifyToken ? (
    <MdLoader />
  ) : (
    <LayoutMain>
      <Charts />
    </LayoutMain>
  );
}

export default Activity;
