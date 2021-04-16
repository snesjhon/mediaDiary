import { useContext } from "react";
import { SupaContext } from "./supaProvider";
import type { SupaUser } from "./supaProvider";

function useSupaUser(): SupaUser {
  return useContext(SupaContext);
}

export default useSupaUser;
