import * as React from "react";
import { useStoreActions } from "../store/store";
import { useEffect } from "react";
import * as firebase from "firebase/app";
import { Redirect } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { User, UserPreferences } from "../store/storeGlobal";

function Login({
  user,
  preferences,
}: {
  user: User;
  preferences: UserPreferences;
}) {
  const userGetPreferences = useStoreActions(
    (actions) => actions.global.userGetPreferences
  );

  useEffect(() => {
    if (user === null) {
      firebase
        .auth()
        .getRedirectResult()
        .then((result) => {
          try {
            userGetPreferences(result.user);
          } catch {
            return console.log("handle no user");
          }
        });
    }
  }, [user]);

  if (user && preferences.year !== null) {
    return <Redirect to={`/${preferences.year}`} />;
  } else if (user && preferences.year === null) {
    return <Redirect to="/setup" />;
  } else {
    return <CircularProgress />;
  }
}

export default Login;
