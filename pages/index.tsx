import {
  Button,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/core";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Layout from "../components/Layout";
import MediaDiary from "../components/MediaDiary";
import useUser from "../utils/useUser";
import Link from "next/link";
import Search from "../components/search";

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
              size="sm"
            >
              <ModalOverlay>
                <ModalContent maxHeight="90vh">
                  <ModalCloseButton />
                  <ModalHeader>Search for Media</ModalHeader>
                  <ModalBody>
                    <Search />
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          )}
        </>
      )}
    </Layout>
  );
}

export default App;
