import { useContext } from "react";
import type { UserFuego } from "../types/typesUser";
import { FuegoContext } from "./fuegoProvider";

function useFuegoUser(): {
  user: UserFuego;
  isValidating: boolean;
} {
  return useContext(FuegoContext);
}

export default useFuegoUser;
