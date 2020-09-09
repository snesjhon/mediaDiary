import React, { useContext } from "react";
import Header from "./Header";
import { Button, Text } from "@chakra-ui/core";
import { ContextState, ContextDispatch, MDState } from "../utils/store";
import { useCollection, useDocument } from "@nandorojo/swr-firestore";
import { fuego } from "@nandorojo/swr-firestore";
import Layout from "./Layout";
import Search from "./Search";
import Log from "../pages/log";
import Media from "./Media";

function MediaDiary() {
  const { user, view } = useContext(ContextState);
  const dispatch = useContext(ContextDispatch);

  return (
    <Layout>
      <Text>You're Logged in</Text>
      <Button onClick={() => changeView("main")}>View main</Button>
      <Button onClick={() => changeView("search")}>View Search</Button>
      <Button onClick={() => changeView("log")}>View log</Button>
      {view === "main" && <Media />}
      {view === "search" && <Search />}
      {view === "log" && <Log />}
    </Layout>
  );

  function changeView(view: MDState["view"]) {
    return dispatch({
      type: "state",
      payload: {
        key: "view",
        value: view,
      },
    });
  }

  // const { data, set, isValidating } = useDocument(`${user.email}/media`);
  // const { data } = useCollection(user.email, { listen: true });
  // const { data: data2, set: set2, isValidating: diaryValidate } = useDocument(
  //   `${user.email}/diary`
  // );

  // console.log(data, data2, isValidating, diaryValidate);
  // console.log(data);
  // function addData() {
  //   const batch = fuego.db.batch();
  //   batch.set(fuego.db.collection(user.email).doc("media"), {
  //     title: "jhon4" + new Date(),
  //   });
  //   batch.set(fuego.db.collection(user.email).doc("diary"), {
  //     title: "jhon5" + new Date(),
  //   });

  //   batch.commit().then(() => {
  //     console.log("happened");
  //   });
  // }
}

export default MediaDiary;
