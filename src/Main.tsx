import * as React from "react";
import { useEffect } from "react";
import { Box } from "./components";
import { useStoreState } from "./config/store";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import MediaSetup from "./MediaSetup";
import Media from "./Media";
import About from "./About";
import MediaProfile from "./MediaProfile";

import { hot } from "react-hot-loader/root";

const Main = () => {
  const user = useStoreState(state => state.global.user);
  const preferences = useStoreState(state => state.global.preferences);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences.theme);
  }, [preferences.theme]);

  return (
    <Box
      id="main"
      className="markdown-body"
      maxWidth={["97vw", "85vw", "75vw", "65vw"]}
      mx="auto"
      my={2}
      p={3}
      border="1px solid var(--border-primary)"
      borderRadius="3px"
      bg="var(--bg-secondary)"
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <HomeRoute />
          </Route>
          <PrivateRoute exact path="/:id(\d+)">
            <Media />
          </PrivateRoute>
          <PrivateRoute exact path="/setup">
            <MediaSetup />
          </PrivateRoute>
          <PrivateRoute exact path="/profile">
            <MediaProfile />
          </PrivateRoute>
        </Switch>
      </Router>
    </Box>
  );

  function HomeRoute() {
    if (user && preferences.year !== null) {
      return <Redirect to={`/${preferences.year}`} />;
    } else if (user && preferences.year === null) {
      return <Redirect to="/setup" />;
    } else {
      return <About />;
    }
  }

  function PrivateRoute({ children, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
};

export default hot(Main);
