import * as React from "react";
import { useEffect } from "react";
import { Box } from "./components";
import { useStoreState } from "./config/store";
import MediaPreference from "./MediaPreference";
import Media from "./Media";
import About from "./About";
import { hot } from "react-hot-loader/root";

const Main = () => {
  // const theme = useStoreState(state => state.global.preferences.theme);
  // document.documentElement.setAttribute("data-theme", theme);
  const user = useStoreState(state => state.global.user);
  const preferences = useStoreState(state => state.global.preferences);

  useEffect(() => {
    if (preferences.theme !== null) {
      document.documentElement.setAttribute("data-theme", preferences.theme);
    }
  }, [preferences.theme]);

  // console.log(preferences);

  const Display = () => {
    if (user && Object.keys(preferences).length > 0) {
      return <Media />;
    } else if (user && Object.keys(preferences).length === 0) {
      return <MediaPreference />;
    } else {
      return <About />;
    }
  };

  return (
    <Box
      id="main"
      className="markdown-body"
      maxWidth={["97vw", "85vw", "75vw", "65vw"]}
      mx="auto"
      my={2}
      p={3}
      border="1px solid #d1d5da"
      borderRadius="3px"
    >
      <Display />
    </Box>
  );
};

export default hot(Main);
