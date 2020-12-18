import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import Preferences from "../src/components/Preferences";
import getSpotifyToken from "../src/config/getSpotifyToken";
import { useMDDispatch, useMDState } from "../src/config/store";
import useFuegoUser from "../src/hooks/useFuegoUser";

function Settings(): JSX.Element {
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

  if (!user && user !== null) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return <MdLoader />;
  } else if (user === null || !spotifyToken) {
    return <MdLoader />;
  } else {
    return (
      <LayoutMain title="Settings">
        <Preferences user={user} />
      </LayoutMain>
    );
  }
}

export default Settings;
