interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

export function getArtistUrl(id: string): string {
  return `https://api.spotify.com/v1/artists/${id}`;
}

export function getAlbumUrl(id: string): string {
  return `https://api.spotify.com/v1/albums/${id}`;
}

export async function spotifyFetch<T>(urlString: string): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new Response(undefined, { status: 401 });
  }

  const response = await fetch(urlString, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}

export async function spotifyFetchAll<T, Y>(
  firstId: string,
  secondId: string
): Promise<[T, Y]> {
  const token = await getAccessToken();

  if (!token) {
    throw new Response(undefined, { status: 401 });
  }

  const responseFirst = fetch(firstId, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  const responseSecond = fetch(secondId, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  return await Promise.all([responseFirst, responseSecond]).then(
    (results) => results
  );
}

export async function getAccessToken(): Promise<string | false> {
  let spotifyToken: false | SpotifyToken = false;
  const token = sessionStorage.getItem("spotifyToken");
  if (token) {
    spotifyToken = JSON.parse(token);
  }

  // If we don't have a token or it's expired get the token and save to sessionStorage
  if (!spotifyToken || (spotifyToken && spotifyToken.expires_at < Date.now())) {
    spotifyToken = await createAccessToken();
  }

  if (spotifyToken) {
    return spotifyToken.access_token;
  }

  return false;
}

export async function createAccessToken(): Promise<SpotifyToken> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT +
            ":" +
            process.env.NEXT_PUBLIC_SPOTIFY_SECRET
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  }).then((r) => r.json());

  const spotifyToken = {
    access_token: response.access_token,
    expires_at: Date.now() + 1000 * response.expires_in,
  };
  sessionStorage.setItem("spotifyToken", JSON.stringify(spotifyToken));

  return spotifyToken;
}
