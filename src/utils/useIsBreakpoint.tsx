import { useMediaQuery, useToken } from "@chakra-ui/react";

function useIsBreakpoint(
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

export default useIsBreakpoint;
