import { Button } from "@chakra-ui/core";
import { useRouter } from "next/router";
import React from "react";
import Day from "../components/Day";
import LogEdit from "../components/LogEdit";
import Header from "../components/Header";
import Layout from "../components/Layout";
import LayoutModal from "../components/LayoutModal";
import Log from "../components/Log";
import MediaDiary from "../components/MediaDiary";
import Search from "../components/Search";
import useUser from "../utils/useUser";

function App() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <Layout>
      {!user ? (
        <Button onClick={() => router.push("/login")}>External Login</Button>
      ) : (
        <>
          <Header />
          <MediaDiary />
          {!!router.query.search && <Search />}
          {!!router.query.log && <Log />}
          {!!router.query.view && router.query.view === "edit" && <LogEdit />}
          {!!router.query.day && (
            <LayoutModal>
              <Day diaryId={router.query.day.toString()} />
            </LayoutModal>
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
