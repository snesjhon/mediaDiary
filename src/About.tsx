/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "./config/store";

const About = () => {
  const userGet = useStoreActions(actions => actions.global.userGet);
  const user = useStoreState(state => state.global.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user !== null && isLoading) {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <CircularProgress />;
  } else {
    return (
      <Container maxWidth="lg">
        <Box border={1} p={2} mt={2} textAlign="center">
          <Typography variant="h3">Media Diary</Typography>
          <Typography variant="h4">
            <Box fontWeight="fontWeightLight">Track All Your Media.</Box>
          </Typography>

          <Button variant="outlined" onClick={signIn}>
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  function signIn() {
    setIsLoading(true);
    userGet();
  }
};

export default About;
