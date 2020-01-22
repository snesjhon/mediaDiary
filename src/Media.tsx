import * as React from "react";
// import { Flex, Box } from "./components";
import MediaList from "./MediaList";
import MediaListMobile from "./MediaListMobile";
import Navigation from "./Navigation";
import { useStoreState } from "./config/store";
import useBP from "./hooks/useBP";
import {
  Container,
  // CircularProgress,
  // Button,
  Box,
  Typography
} from "@material-ui/core";

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
  const bp = useBP();
  return (
    <Box my={2}>
      <Container maxWidth="lg">
        <Navigation />
        <Box borderColor="grey.300" border={1} borderTop={0} p={2}>
          <Box display="flex" justifyContent="space-between" pt={3} pb={5}>
            <Box>
              <Box pb={2}>
                <Typography>
                  All caps, bold:{" "}
                  <Box
                    component="span"
                    // color="secondary.main"
                    fontWeight="fontWeightBold"
                  >
                    MOVIES
                  </Box>
                </Typography>
              </Box>
              <Box pb={2}>
                <Typography>
                  All caps:{" "}
                  <Box
                    component="span"
                    // color="secondary.main"
                  >
                    TV SERIESS
                  </Box>
                </Typography>
              </Box>
              <Typography>
                Italics:{" "}
                <Box
                  component="em"
                  // color="secondary.main"
                >
                  Albums
                </Box>
              </Typography>
            </Box>
            <Box>
              <Typography>
                <strong> {types.film} MOVIES</strong>
              </Typography>
              <Typography>{types.tv} TV SERIES</Typography>
              <Typography>
                {types.album} <em>Albums</em>
              </Typography>
            </Box>
          </Box>
          {bp !== "mobile" ? (
            <>
              <MediaList />
            </>
          ) : (
            <MediaListMobile />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Media;
