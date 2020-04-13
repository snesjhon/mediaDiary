import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import About from "./About";
import { useStoreState } from "./config/store";
import MediaList from "./MediaList";
import Navigation from "./Navigation";
import Profile from "./Profile";
import Setup from "./Setup";
import Sidebar from "./Sidebar";
import Taskbar from "./Taskbar";

const useStyles = makeStyles(_ => ({
  container: {
    minHeight: "95vh"
  },
  containerGrid: {
    display: "grid",
    gridTemplateColumns: "13rem 1fr 16rem"
  }
}));

function Main() {
  const user = useStoreState(state => state.global.user);
  const preferences = useStoreState(state => state.global.preferences);

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
          <MediaList />
        </PrivateRoute>
        <PrivateRoute exact path="/setup">
          <Setup />
        </PrivateRoute>
        <PrivateRoute exact path="/profile">
          <Profile />
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
            <Container className={classes.containerGrid} maxWidth="lg">
              <Sidebar />
              <Box
                className={classes.container}
                borderColor="grey.300"
                border={1}
                borderTop={0}
              >
                {children}
              </Box>
              <Taskbar />
            </Container>
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
}

export default Main;
