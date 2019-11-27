import * as React from "react";
import { Box } from "./components";
import { useStoreState } from "./config/store";
import Media from "./Media";
import About from "./About";
import Navigation from "./Navigation";
import { hot } from "react-hot-loader/root";

const Main = () => {
  const theme = useStoreState(state => state.global.theme);
  document.documentElement.setAttribute("data-theme", theme);
  const user = useStoreState(state => state.global.user);

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
      <Navigation user={user} />
      {user ? <Media user={user} /> : <About />}
    </Box>
  );
};

export default hot(Main);
