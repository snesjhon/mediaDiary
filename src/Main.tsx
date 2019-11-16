/**
 * MAIN
 * ---
 * Search, with debounce, and wait until a millsecond before searching the query, and then
 * display a list of titles. Which onClick, will then display the backdrop art.
 *
 *
 *
 * movies : {
 *  byID: 123: { info }
 *  allIDs: []
 *  byDate: TS: [1,2,3,4]
 * }
 *
 */
import * as React from "react";
import { useState, useEffect } from "react";
import { hot } from "react-hot-loader/root";
import { Box, Text, Flex } from "./components";
import MediaList from "./MediaList";
import MediaModal from "./MediaModal";
import Auth from "./config/auth";
import * as firebase from "firebase/app";
import "firebase/auth";

const App = () => {
  document.documentElement.setAttribute("data-theme", "light");
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("user not log");
      }
    });
  }, []);

  return (
    <Box
      id="main"
      className="markdown-body"
      maxWidth={["97vw", "85vw", "75vw", "65vw"]}
      mx="auto"
      my={2}
      p={3}
      border="1px solid #d1d5da"
      borderRadius="3px"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Text fontSize={4} fontWeight={600}>
            Media Diary
          </Text>
          <Text as="span" fontSize={4} ml={2} fontWeight={300}>
            /
          </Text>
          <Text as="span" fontSize={4} ml={2} fontWeight={300} color="orange">
            2019
          </Text>
        </Flex>
        <Box>{currentUser ? <MediaModal /> : <Auth />}</Box>
      </Flex>

      <Box my={2} borderTop="1px solid #d1d5da" />

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
      <MediaList />
    </Box>
  );
};
export default hot(App);
