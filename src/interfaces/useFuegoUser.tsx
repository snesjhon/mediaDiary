import { useContext } from "react";
import type { FuegoUser } from "../config/types";
import { FuegoContext } from "./fuegoProvider";

function useFuegoUser(): {
  user: FuegoUser;
  isValidating: boolean;
} {
  return useContext(FuegoContext);
}

export default useFuegoUser;
