import * as React from "react";
import { Flex, Text, Box, Grid } from "./components";
import MediaModal from "./MediaModal";
import User from "./User";
const Navigation = () => {
  return (
    <>
      <Grid alignItems="center" gridTemplateColumns="1fr 1fr 2rem">
        <Flex>
          <Text fontSize={4} fontWeight={600}>
            Media Diary
          </Text>
        </Flex>
        <MediaModal />
        <User />
      </Grid>
      <Box my={2} borderTop="1px solid #d1d5da" />
    </>
  );
};

export default Navigation;
