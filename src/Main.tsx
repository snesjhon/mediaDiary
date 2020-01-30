import * as React from "react";
import { useEffect } from "react";
import { hot } from "react-hot-loader/root";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import About from "./About";
import { useStoreState } from "./config/store";
import Media from "./Media";
import MediaProfile from "./MediaProfile";
import MediaSetup from "./MediaSetup";

const Main = () => {
  const user = useStoreState(state => state.global.user);
  const preferences = useStoreState(state => state.global.preferences);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences.theme);
  }, [preferences.theme]);

  return (
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
