import * as React from "react";
import { useCallback } from "react";
import { useStoreActions } from "./config/store";

const Navigation = () => {
  const verifyUser = useStoreActions(actions => actions.global.verifyUser);
  const onLogin = useCallback(() => {
    verifyUser().then(() => console.log("happend"));
  }, [verifyUser]);
  return <div onClick={onLogin}>login</div>;
};

export default Navigation;
