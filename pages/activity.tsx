import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { parseCookies } from "nookies";
import React from "react";
import Charts from "../src/components/Charts";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import { getFuegoToken, getRefreshToken } from "../src/config/getSSRProps";

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

function Activity({
  fuegoToken,
  refreshToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return !fuegoToken || !refreshToken ? (
    <MdLoader />
  ) : (
    <LayoutMain>
      <Charts />
    </LayoutMain>
  );
}

export default Activity;
