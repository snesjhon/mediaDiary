import { Theme, useMediaQuery, useToken } from "@chakra-ui/react";

export function fetcher(url: string) {
  const urlString =
    process.env.NODE_ENV === "development" ? `${url}&isLocal=true` : url;
  return fetch(urlString).then((res) => res.json());
}

export function useIsBreakpoint(
  size: keyof {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  }
): boolean {
  const bp = useToken("breakpoints", [size]);
  const [isBp] = useMediaQuery(`(min-width: ${bp})`);
  return isBp;
}
