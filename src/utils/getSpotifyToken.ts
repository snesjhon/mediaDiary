function getSpotifyToken(): Promise<any> {
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT;
  const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_SECRET;

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  })
    .then((r) => r.json())
    .then((spotifyResponse) => {
      return spotifyResponse.access_token;
    })
    .catch((e) => console.error("[SPOTIFY]: failed to refresh token"));
}

export default getSpotifyToken;
