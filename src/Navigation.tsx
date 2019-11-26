import * as React from "react";
import { Flex, Text, Box } from "./components";
import MediaModal from "./MediaModal";
import User from "./User";
const Navigation = (props: any) => {
  const { user } = props;
  return (
    <>
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
        {user && <MediaModal />}
        <User user={user} />
      </Flex>

      <Box my={2} borderTop="1px solid #d1d5da" />
    </>
  );
};

export default Navigation;

// import * as React from "react";
// import { useState, useCallback } from "react";
// import { useStoreActions, useStoreState } from "./config/store";
// import MediaModal from "./MediaModal";
// import * as firebase from "firebase/app";

// const Navigation = () => {
//   return <div>asd</div>;
//   // const existingUser = firebase.auth().currentUser;
//   // const user = useStoreState(state => state.global.user);
//   // console.log(user, existingUser);

//   // firebase.auth().onAuthStateChanged(function(user) {
//   //   if (user) {
//   //     // User is signed in.
//   //     console.log(user, "another");
//   //   } else {
//   //     // No user is signed in.
//   //   }
//   // });

//   return <div>asd</div>;
//   // const verifyUser = useStoreActions(actions => actions.global.verifyUser);
//   // const [verifiedUser, setVerifiedUser] = useState(firebase.auth().currentUser);
//   // console.log(verifiedUser);
//   // const onLogin = useCallback(() => {
//   //   verifyUser();
//   // }, [verifyUser]);
//   // return user ? <MediaModal /> : <div onClick={onLogin}>login</div>;
// };

// export default Navigation;
