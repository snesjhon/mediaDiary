import * as React from "react";
import { useState, useCallback } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import MediaModal from "./MediaModal";
import * as firebase from "firebase/app";

const Navigation = () => {
  const user = useStoreState(state => state.global.user);
  const verifyUser = useStoreActions(actions => actions.global.verifyUser);
  const [verifiedUser, setVerifiedUser] = useState(firebase.auth().currentUser);
  console.log(verifiedUser);
  const onLogin = useCallback(() => {
    verifyUser();
  }, [verifyUser]);
  return user ? <MediaModal /> : <div onClick={onLogin}>login</div>;
};

export default Navigation;
