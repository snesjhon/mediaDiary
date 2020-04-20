import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import About from "./About";
import { useStoreState } from "./config/store";
import MediaList from "./MediaList";
import Navigation from "./Navigation";
import Profile from "./Profile";
import Setup from "./Setup";
import Sidebar from "./Sidebar";
import Taskbar from "./Taskbar";

const useStyles = makeStyles((_) => ({
  container: {
    minHeight: "95vh",
  },
  containerGrid: {
    // width: "100%",
    // padding: 0,
    // display: "grid",
    // gridTemplateColumns: "13rem 1fr 16rem"
  },
}));

export interface MediaListProp {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

function Main() {
  const [openDrawer, setOpenDrawer] = useState(false);
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
          <MediaList setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
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
  //  {/* <Taskbar /> */}
  //           {/* </Container> */}
  // // <Container className={classes.containerGrid} maxWidth={false}>
  //             {/* <Sidebar /> */}

  function PrivateRoute({ children, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          user ? (
            <Box
              className={classes.container}
              // borderColor="grey.300"
              // border={1}
              // borderTop={0}
            >
              <Navigation
                setOpenDrawer={setOpenDrawer}
                openDrawer={openDrawer}
              />
              {children}
            </Box>
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
