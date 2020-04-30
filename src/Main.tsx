import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useStoreState } from "./store/store";
import MediaDiary from "./app/MediaDiary";
import Login from "./pages/Login";

const useStyles = makeStyles((_) => ({
  container: {
    minHeight: "95vh",
  },
}));

function Main() {
  const user = useStoreState((state) => state.global.user);
  const preferences = useStoreState((state) => state.global.preferences);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences.theme);
  }, [preferences.theme]);

  const classes = useStyles();
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomeRoute />
        </Route>
        <PrivateRoute exact path="/:id(\d+)">
          <MediaDiary />
        </PrivateRoute>
        <PrivateRoute exact path="/setup">
          <div />
        </PrivateRoute>
        <PrivateRoute exact path="/profile">
          <div />
        </PrivateRoute>
      </Switch>
    </Router>
  );

  function HomeRoute() {
    if (user && preferences.year !== null) {
      return <Redirect to={`/${preferences.year}`} />;
    } else if (user && preferences.year === null) {
      return <Redirect to="/setup" />;
    } else {
      return <Login />;
    }
  }

  function PrivateRoute({ children, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            <Box className={classes.container}>{children}</Box>
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        }
      />
    );
  }
}

export default Main;
