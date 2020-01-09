/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import * as React from "react";
import { useState, useEffect } from "react";
// import { Box, Text, Icon, Flex } from "./components";
import { useStoreActions, useStoreState } from "./config/store";
import {
  Container,
  CircularProgress,
  Button,
  Box,
  Typography
} from "@material-ui/core";
import { LiveTv, MusicVideo, MovieOutlined } from "@material-ui/icons";

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
          <Box display="flex" justifyContent="center">
            <MovieOutlined />
            <LiveTv />
            <MusicVideo />
          </Box>
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

// <Flex flexDirection="column" alignItems="center">
// <Flex mt={4}>

// </Flex>
//           <Text as="h1" textAlign="center" fontWeight={600} mt={2}>
//             MediaDiary
//           </Text>
//         </Flex>
//         <Box my={3} borderTop="1px solid #d1d5da" />
//         <Text fontSize={4} textAlign="center">
//           Track All Your Media.
//         </Text>
//         <Flex justifyContent="center" my={4}>
//         </Flex>
