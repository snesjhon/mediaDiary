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
  console.log(!!router.query.search);
  return (
    <Layout>
      {!user ? (
        <Button onClick={() => router.push("/login")}>External Login</Button>
      ) : (
        <>
          <Header />
          <MediaDiary />
          {!!router.query.search && (
            <Modal
              isOpen={true}
              onClose={() => router.push("/")}
              scrollBehavior="inside"
              size="xs"
            >
              <ModalOverlay>
                <ModalContent maxHeight="90vh">
                  <ModalCloseButton />
                  <ModalHeader pb={2}>Search for Media</ModalHeader>
                  <ModalBody pt={1}>
                    <Search />
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )}
          {!!router.query.log && <Log />}
        </>
      )}
    </Layout>
  );
}

export default App;
