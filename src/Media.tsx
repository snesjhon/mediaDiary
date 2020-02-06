import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import * as React from "react";
import MediaList from "./MediaList";
import Navigation from "./Navigation";

const Media = () => {
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
