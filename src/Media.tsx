import * as React from "react";
import { Flex, Box } from "./components";
import MediaList from "./MediaList";

interface MediaProps {
  user: firebase.User;
}
const Media = (props: MediaProps) => {
  return (
    <>
      <Flex justifyContent="space-between">
        <Box my={4}>
          <p>
            All caps, bold: <strong>MOVIES</strong>
          </p>
          <p>All caps: TV SERIES</p>
          <p>
            Italics: <em>Albums</em>
          </p>
        </Box>
        <Box my={4}>
          <p>
            <strong> 100 MOVIES</strong>
          </p>
          <p>20 TV SERIES</p>
          <p>
            15 <em>Albums</em>
          </p>
        </Box>
      </Flex>
      <MediaList user={props.user} />
    </>
  );
};

export default Media;

// {/* <MediaList /> */}
