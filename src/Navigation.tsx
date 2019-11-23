import * as React from "react";
import { useState, useCallback } from "react";
import { useStoreActions } from "./config/store";
import MediaModal from "./MediaModal";

const Navigation = () => {
  const verifyUser = useStoreActions(actions => actions.global.verifyUser);
  const [verifiedUser, setVerifiedUser] = useState(false);
  const onLogin = useCallback(() => {
    verifyUser().then(() => setVerifiedUser(true));
  }, [verifyUser]);
  return verifiedUser ? <MediaModal /> : <div onClick={onLogin}>login</div>;
};

export default Navigation;
