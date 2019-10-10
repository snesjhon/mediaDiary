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

import React from "react";
import { hot } from "react-hot-loader/root";
import { Box, Text, Flex } from "./components";
import MediaList from "./MediaList";
import MediaModal from "./MediaModal";
// import MediaSearch from "./MediaSearch";

const App = () => {
  return (
    <Box
      className="markdown-body"
      maxWidth={["", "80vw", "70vw", "60vw", "50vw"]}
      height="94.5vh"
      mx="auto"
      my={2}
      p={3}
      border="1px solid #d1d5da"
      borderRadius="3px"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Text fontSize={4} fontWeight="600">
            Media Diary
          </Text>
          <Text as="span" fontSize={4} ml={2} fontWeight="300">
            /
          </Text>
          <Text
            as="span"
            fontSize={4}
            ml={2}
            fontWeight="300"
            color="madOrange"
          >
            2019
          </Text>
        </Flex>
        <Box textAlign="right">
          <MediaModal />
          {/* <Text fontWeight="400">Login</Text> */}
        </Box>
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
        <Box>
          <Text
            fontSize={3}
            fontWeight={600}
            textAlign="right"
            borderBottom="1px solid borderGray"
          >
            Stats
          </Text>
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
// batch.set(moviesByID, {
//   [e.id.toString()]: e
// });

// batch.set(moviesByDate, {
// [new Date().toLocaleDateString()]: firebase.firestore.FieldValue.arrayUnion(
//   e.id
// )
// });

// batch.commit().then(function() {
//   console.log("happened");
// });

// db.runTransaction(transaction => transaction.get())

// db.runTransaction(function(transaction) {
//   const currentDate = firebase.firestore.Timestamp.fromDate(
//     new Date()
//   ).toString();
//   return transaction.get(sfDocRef).then(function(sfDoc: any) {
//     if (!sfDoc.exists) {
//       transaction.set(sfDocRef, {
//         info: e,
//         log: {
//           [currentDate]: {
//             date_added: new Date(),
//             rewatched: false
//           }
//         }
//       });
//     }

//     var currentLog = sfDoc.data().log;
//     transaction.update(sfDocRef, {
//       info: e,
//       log: {
//         ...currentLog,
//         [currentDate]: {
//           date_added: new Date(),
//           rewatched: false
//         }
//       }
//     });
//   });
// })
//   .then(function() {
//     console.log("Transaction successfully committed!");
//   })
//   .catch(function(error) {
//     console.log("Transaction failed: ", error);
//   });
// db.collection("movies")
//   .doc(e.id.toString())
//   .set({ ...e, date_added: new Date() })
//   .then(function() {
//     console.log("Document successfully written!");
//   })
//   .catch(function(error) {
//     console.error("Error writing document: ", error);
//   });

// [new Date()
//   .toLocaleDateString()
//   .replace(/\//g, "-")]: firebase.firestore.FieldValue.arrayUnion(
//   e.id
// )
// count:
//   typeof currentDate !== "undefined" &&
//   typeof currentDate[e.id] !== "undefined" &&
//   typeof currentDate[e.id]["count"] !== "undefined"
//     ? currentDate[e.id]["count"] + 1
//     : 1,
// index: currentIndex

// console.log("happens");

// typeof currentDate !== "undefined" &&
// typeof currentDate[e.id] !== "undefined" &&
// typeof currentDate[e.id]["index"] !== "undefined"
//   ? Object.keys(currentDate).length
//   : 0;

// let currentIndex = 0;
// // console.log(currentDate);
// if (typeof currentDate !== "undefined") {
//   // We have an index, so keep it
//   if (typeof currentDate[e.id] !== "undefined") {
//     // console.log("not undefined");
//     // console.log(currentDate[e.id]);
//     if (typeof currentDate[e.id]["index"] !== "undefined") {
//       // console.log("index");
//       currentIndex = currentDate[e.id]["index"];
//     }
//     // } else {
//     //   console.log("length");
//     //   currentIndex = Object.keys(currentDate).length;
//     // }
//   } else {
//     currentIndex = Object.keys(currentDate).length;
//   }
// }
// [new Date()
//   .toLocaleDateString()
//   .replace(/\//g, "-")]: firebase.firestore.FieldValue.arrayUnion({
//   id: e.id,
//   index: firebase.firestore.FieldValue.increment(1)
// })
