import {
  Button,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spacer,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Layout from "../components/Layout";
import MediaDiary from "../components/MediaDiary";
import useUser from "../utils/useUser";
import Link from "next/link";
import Search from "../components/Search";
import Log from "../components/Log";

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
          {!!router.query.search && <Search />}
          {!!router.query.log && <Log />}
        </>
      )}
    </Layout>
  );
}

export default App;
