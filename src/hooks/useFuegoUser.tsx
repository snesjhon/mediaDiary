import { useContext } from "react";
import type { FuegoUser } from "../interfaces/fuegoProvider";
import { FuegoContext } from "../interfaces/fuegoProvider";

function useFuegoUser(): {
  user: FuegoUser;
} {
  return useContext(FuegoContext);
}

export default useFuegoUser;
