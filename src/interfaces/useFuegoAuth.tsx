import { useEffect } from "react";
import { useMDDispatch, useMDState } from "../config/store";
import type { FuegoValidatedUser } from "../config/types";
import { fuegoDb } from "./fuego";
import useFuegoUser from "./useFuegoUser";

interface FuegoAuth {
  /** User not in our system */
  userNotValid: boolean;
  /** User has no preferences, route to NewUser */
  userNoPreference: boolean;
  /** Validating user, show loaders */
  userValidating: boolean;
  /** User is valid, but might not have Preference */
  userValid: FuegoValidatedUser | false;
  /** User is valid and has preference, show MediaDiary */
  userValidHasPreference: FuegoValidatedUser | false;
}

/**
 * A hook to provide a consistent way of getting necessary information during our
 * authentication process.
 */
function useFuegoAuth(): FuegoAuth {
  const { user, isValidating } = useFuegoUser();
  const { preference } = useMDState();
  const dispatch = useMDDispatch();

  // if we have a user but no preferences then get it!
  useEffect(() => {
    if (user && preference === null) {
      fuegoDb
        .collection("users")
        .doc(user.uid)
        .get()
        .then((data) => {
          dispatch({
            type: "state",
            payload: {
              key: "preference",
              value: data.get("preference") ?? false,
            },
          });
        });
    }
  }, [dispatch, user, preference]);

  // Validating requires two states, either we're waiting for SpotifyToken or just waiting for
  // userpreferences to validate
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

export default useFuegoAuth;
