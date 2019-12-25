import * as React from "react";
import { Flex, Box } from "./components";
import MediaList from "./MediaList";
import Navigation from "./Navigation";
import { useStoreState } from "./config/store";

const Media = () => {
  const media = useStoreState(state => state.data.byID);
  const types = Object.keys(media).reduce<{
    [key: string]: number;
  }>((a, c) => {
    if (typeof a[media[c]["type"]] !== "undefined") {
      a[media[c]["type"]] = ++a[media[c]["type"]];
    } else {
      a[media[c]["type"]] = 1;
    }
    return a;
  }, {});
  return (
    <>
      <Navigation />
      <Flex justifyContent="space-between">
        <Box my={4}>
          <p>
            All caps, bold: <strong>MOVIES</strong>
          </p>
          <p>All caps: TV SERIES (and season)</p>
          <p>
            Italics: <em>Albums</em>
          </p>
        </Box>
        <Box my={4}>
          <p>
            <strong> {types.film} MOVIES</strong>
          </p>
          <p>{types.tv} TV SERIES</p>
          <p>
            {types.album} <em>Albums</em>
          </p>
        </Box>
      </Flex>
      <MediaList />
    </>
  );
};

export default Media;
