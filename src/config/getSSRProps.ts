import type { GetServerSidePropsContext } from "next";
import { setCookie } from "nookies";
import type { ParsedUrlQuery } from "querystring";
import fuegoAdmin from "../interfaces/fuegoAdmin";

interface CookiesProps {
  [key: string]: string;
}
export async function getFuegoToken(
  cookies: CookiesProps
): Promise<fuegoAdmin.auth.DecodedIdToken | false> {
  try {
    const fuegoToken = await fuegoAdmin
      .auth()
      .verifyIdToken(cookies.fuegoToken);
    return fuegoToken;
  } catch {
    throw false;
  }
}

export async function getRefreshToken(
  cookies: CookiesProps,
  context: GetServerSidePropsContext<ParsedUrlQuery>
): Promise<false | string> {
  try {
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
    const refreshToken = spotifyResponse.access_token;
    setCookie(context, "refreshToken", refreshToken, {
      maxAge: 3600,
    });
    return refreshToken;
  } catch {
    throw false;
  }
}
