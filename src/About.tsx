/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Text, Icon, Flex, Button } from "./components";
import { useStoreActions, useStoreState } from "./config/store";

const About = () => {
  const userGet = useStoreActions(actions => actions.global.userGet);
  const user = useStoreState(state => state.global.user);
  const [isLoading, setIsLoading] = useState(false);

  console.log(user);
  useEffect(() => {
    if (user !== null && isLoading) {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>loading</div>;
  } else {
    return (
      <Box>
        <Flex flexDirection="column" alignItems="center">
          <Flex mt={4}>
            <Icon name="album" mr={3} stroke="orange" />
            <Icon name="tv" mr={3} stroke="blue" />
            <Icon name="film" mr={3} stroke="secondary" />
          </Flex>
          <Text as="h1" textAlign="center" fontWeight={600} mt={2}>
            MediaDiary
          </Text>
        </Flex>
        <Box my={3} borderTop="1px solid #d1d5da" />
        <Text fontSize={4} textAlign="center">
          Track All Your Media.
        </Text>
        <Flex justifyContent="center" my={4}>
          <Button variant="secondary" onClick={signIn}>
            Sign In
          </Button>
        </Flex>
      </Box>
    );
  }

  function signIn() {
    setIsLoading(true);
    userGet();
  }
};

export default About;
