/**
 * useBP
 * ---
 * Using the themeContext we can define an eventListener to update us on what kind of breakpoint
 * we're at, and then re-(render)? what position and pass that through the connected components
 *
 * Resources
 * - https://medium.com/better-programming/usebreakpoint-hook-get-media-query-breakpoints-in-react-3f1779b73568
 */

import { useState, useEffect } from "react";
import { BP } from "../config/theme";
// import useDebounce from "./useDebounce";

// returns the current breakpoint
function useBP() {
  const [brkPnt, setBrkPnt] = useState(() => getBP(window.innerWidth));
  // const calcInner = () => {};
  useEffect(() => {
    const calcInner = () => setBrkPnt(getBP(window.innerWidth));
    // const calcInnerWidth = throttle(function() {
    //   setBrkPnt(getDeviceConfig(window.innerWidth))
    // }, 200);

    window.addEventListener("resize", calcInner);
    return () => window.removeEventListener("resize", calcInner);
  }, []);

  return brkPnt;
}

function getBP(width: number) {
  const bp = Object.keys(BP).reduce((a, c, i, arr) => {
    if (width < BP[arr[0]]) {
      return a;
    } else if (width > BP[arr[arr.length - 1]]) {
      a = arr[arr.length - 1];
    } else if (
      BP[c] <= width &&
      BP[arr[i < arr.length - 1 ? i + 1 : arr.length - 1]] >= width
    ) {
      a = c;
    }
    return a;
  }, "mobile");
  return bp;
}

export default useBP;
