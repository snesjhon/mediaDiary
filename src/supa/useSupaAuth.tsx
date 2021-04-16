import { useEffect } from "react";
import supa from ".";
import { useMDDispatch, useMDState } from "../config/store";
import type { UserSupaValidated } from "../types/typesUser";
import useSupaUser from "./useSupaUser";

interface SupaAuth {
  /** User not in our system */
  userNotValid: boolean;
  /** User has no preferences, route to NewUser */
  userNoPreference: boolean;
  /** Validating user, show loaders */
  userValidating: boolean;
  /** User is valid, but might not have Preference */
  userValid: UserSupaValidated | false;
  /** User is valid and has preference, show MediaDiary */
  userValidHasPreference: UserSupaValidated | false;
}

/**
 * A hook to provide a consistent way of getting necessary information during our
 * authentication process.
 */
function useSupaAuth(): SupaAuth {
  const { user, isValidating } = useSupaUser();
  const { preference } = useMDState();
  const dispatch = useMDDispatch();

  // if we have a user but no preferences then get it!
  useEffect(() => {
    async function getPref() {
      if (user && preference === null) {
        const { data: userPref, error } = await supa
          .from("users")
          .select("mediaTypes, theme")
          .filter("uuid", "eq", user.id);
        if (error || userPref?.length === 0) {
          dispatch({
            type: "state",
            payload: { key: "preference", value: false },
          });
        }
        if ((!error || userPref?.length === 1) && userPref) {
          dispatch({
            type: "state",
            payload: { key: "preference", value: userPref[0] },
          });
        }
      }
    }
    getPref();
  }, [dispatch, user, preference]);

  let userValidating = true;
  if (preference !== null && preference) {
    userValidating = user === null;
  } else {
    userValidating = user === null && preference === null;
  }

  return {
    userNotValid: !user && user !== null,
    userNoPreference: user !== null && preference !== null && !preference,
    userValidating: userValidating || isValidating,
    userValid: user && user !== null ? user : false,
    userValidHasPreference:
      user && user !== null && preference !== null && preference ? user : false,
  };
}

export default useSupaAuth;
