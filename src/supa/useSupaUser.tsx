import { useContext } from "react";
import type { UserFuego } from "../types/typesUser";
import { SupaContext } from "./supaProvider";

function useSupaUser(): {
  user: UserFuego;
} {
  return useContext(SupaContext);
}

export default useSupaUser;
