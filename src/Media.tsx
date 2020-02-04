import { Box, Container } from "@material-ui/core";
import * as React from "react";
import MediaList from "./MediaList";
import Navigation from "./Navigation";

const Media = () => {
  // const media = useStoreState(state => state.data.byID);
  // const bp = useBP();
  return (
    <Container maxWidth="md">
      <Navigation />
      <Box borderColor="grey.300" border={1} borderTop={0} px={2}>
        <MediaList />
      </Box>
    </Container>
  );
};

export default Media;
