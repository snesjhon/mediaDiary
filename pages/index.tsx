import { Button } from "@chakra-ui/core";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Layout from "../components/Layout";
import MediaDiary from "../components/MediaDiary";
import useUser from "../utils/useUser";

function App() {
  const { user, logout } = useUser();
  const router = useRouter();
  return (
    <Layout>
      {!user ? (
        <Button onClick={() => router.push("/login")}>External Login</Button>
      ) : (
        <>
          <Header />
          <MediaDiary />
        </>
      )}
    </Layout>
  );
}

export default App;
