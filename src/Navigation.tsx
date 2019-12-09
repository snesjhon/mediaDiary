import * as React from "react";
import { Flex, Text, Box, Grid } from "./components";
import MediaAdd from "./MediaAdd";
import User from "./User";
import { useStoreState } from "./config/store";
import { Link } from "react-router-dom";

const Navigation = () => {
  const year = useStoreState(state =>
    state.global.preferences.year !== null ? state.global.preferences.year : ""
  );
  return (
    <>
      <Grid alignItems="center" gridTemplateColumns="1fr 1fr 2rem">
        <Flex>
          <Text fontSize={4} fontWeight={600}>
            <Link to="/">Media Diary</Link>
          </Text>
          <Text as="span" fontSize={4} ml={2} fontWeight={300}>
            /
          </Text>
          <Text as="span" fontSize={4} ml={2} fontWeight={300} color="orange">
            {year}
          </Text>
        </Flex>
        <MediaAdd />
        <User />
      </Grid>
      <Box my={2} borderTop="1px solid #d1d5da" />
    </>
  );
};

export default Navigation;
