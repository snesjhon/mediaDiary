/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import * as React from "react";
import { Box, Text, Icon, Flex, Button } from "./components";
import { useStoreActions } from "./config/store";

const About = () => {
  const userVerify = useStoreActions(actions => actions.global.userVerify);
  return (
    <Box>
      <Flex flexDirection="column" alignItems="center">
        <Flex mt={4}>
          <Icon name="album" mr={3} stroke="var(--orange)" />
          <Icon name="tv" mr={3} stroke="var(--blue)" />
          <Icon name="film" mr={3} stroke="var(--secondary)" />
        </Flex>
        <Text fontSize={5} textAlign="center" fontWeight={600} mt={2}>
          MediaDiary
        </Text>
      </Flex>
      <Box my={3} borderTop="1px solid #d1d5da" />
      <Text fontSize={4} textAlign="center">
        Track All Your Media.
      </Text>
      <Flex justifyContent="center" my={4}>
        <Button variant="secondary" onClick={() => userVerify()}>
          Sign In
        </Button>
      </Flex>
    </Box>
  );
};

export default About;
