export function fetcher(url: string) {
  const urlString =
    process.env.NODE_ENV === "development" ? `${url}&isLocal=true` : url;
  return fetch(urlString).then((res) => res.json());
}
