/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import * as firebase from "firebase/app";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();
  return (
    <Container maxWidth="lg">
      <Box border={1} p={2} mt={2} textAlign="center">
        <Typography variant="h3">Media Diary</Typography>
        <Typography variant="h4">
          <Box fontWeight="fontWeightLight">Track All Your Media.</Box>
        </Typography>
        <Button variant="outlined" onClick={() => signIn()}>
          Login
        </Button>
      </Box>
    </Container>
  );

  function signIn() {
    history.push("/login");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => firebase.auth().signInWithRedirect(provider));
  }
}

export default Home;
