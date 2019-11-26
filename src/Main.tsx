import * as React from "react";
import { useEffect } from "react";
import { Box } from "./components";
import Media from "./Media";
import About from "./About";
import { fb } from "./config/db";
import { useStoreActions, useStoreState } from "./config/store";
import { hot } from "react-hot-loader/root";
import Navigation from "./Navigation";

const Main = () => {
  const theme = useStoreState(state => state.global.theme);
  document.documentElement.setAttribute("data-theme", theme);
  const user = useStoreState(state => state.global.user);
  const addUser = useStoreActions(actions => actions.global.addUser);

  useEffect(() => {
    fb.auth().onAuthStateChanged(function(userRes) {
      if (userRes) {
        addUser(user);
      }
    });
  }, [user]);

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
      <Navigation user={user} />
      {user ? <Media /> : <About />}
    </Box>
  );
};

export default hot(Main);

// /**
//  * MAIN
//  * ---
//  * Search, with debounce, and wait until a millsecond before searching the query, and then
//  * display a list of titles. Which onClick, will then display the backdrop art.
//  *
//  *
//  */
// import * as React from "react";
// import { useEffect } from "react";
// // import { Store } from "./config/store";
// // import { useState, useEffect } from "react";
// import { hot } from "react-hot-loader/root";
// import { Box, Text, Flex } from "./components";
// import MediaList from "./MediaList";
// // import { useStoreState } from 'easy-peasy';
// import { useStoreState, useStoreActions } from "./config/store";
// import Navigation from "./Navigation";
// import {db } from "./config/db";
// import * as firebase from "firebase/app";
// import "firebase/auth";
// // import {useStoreActions} from "./config/store";
// // import MediaModal from "./MediaModal";
// // import Auth from "./config/auth";
// // import { authUser } from "./config/actions";

// // const App = () => {
// const theme = useStoreState(state => state.global.theme);
// document.documentElement.setAttribute("data-theme", theme);

// //   const user = useStoreState(state => state.global.user);
// //   const verifyUser = useStoreActions(actions => actions.global.verifyUser);
// //   const addUser = useStoreActions(actions => actions.global.addUser);

// //   useEffect(() => {
// //     firebase.auth().onAuthStateChanged(function(user) {
// //       if (user) {
// //         addUser(user);
// //       } else {
// //         verifyUser();
// //       }
// //     });
// //   }, [user]);

// //   return (
// //     <Box
// //       id="main"
// //       className="markdown-body"
// //       maxWidth={["97vw", "85vw", "75vw", "65vw"]}
// //       mx="auto"
// //       my={2}
// //       p={3}
// //       border="1px solid #d1d5da"
// //       borderRadius="3px"
// //     >
// //       <Flex justifyContent="space-between" alignItems="center">
// //         <Flex>
// //           <Text fontSize={4} fontWeight={600}>
// //             Media Diary
// //           </Text>
// //           <Text as="span" fontSize={4} ml={2} fontWeight={300}>
// //             /
// //           </Text>
// //           <Text as="span" fontSize={4} ml={2} fontWeight={300} color="orange">
// //             2019
// //           </Text>
// //         </Flex>
// //         <Navigation />
// //         {/* <Box>{currentUser ? <MediaModal /> : <Auth />}</Box> */}
// //       </Flex>

// //       <Box my={2} borderTop="1px solid #d1d5da" />

// //       <Flex justifyContent="space-between">
// //         <Box my={4}>
// //           <p>
// //             All caps, bold: <strong>MOVIES</strong>
// //           </p>
// //           <p>All caps: TV SERIES</p>
// //           <p>
// //             Italics: <em>Albums</em>
// //           </p>
// //         </Box>
// //         <Box my={4}>
// //           <p>
// //             <strong> 100 MOVIES</strong>
// //           </p>
// //           <p>20 TV SERIES</p>
// //           <p>
// //             15 <em>Albums</em>
// //           </p>
// //         </Box>
// //       </Flex>
// //       <MediaList />
// //     </Box>
// //   );
// // };
// // export default hot(App);

// // // console.log(theme);

// // // const { state, dispatch } = useContext(Store);
// // // console.log(state, dispatch);
// // // const [currentUser, setCurrentUser] = useState();
// // // useEffect(() => {
// // //   // authUser();
// // // }, []);
