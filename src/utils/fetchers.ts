export function spotifyFetch(
  urlString: string,
  token: string
): Promise<unknown> {
  return fetch(urlString, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
}

export function fetcher(urlString: string): Promise<any> {
  return fetch(urlString).then((res) => res.json());
}
