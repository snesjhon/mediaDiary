import { Container, Box, Heading, Button, Text } from "@chakra-ui/core";
import { useRouter } from "next/router";
import useUser from "../utils/useUser";
import Header from "../components/Header";
import { useCollection } from "@nandorojo/swr-firestore";
import MediaDiary from "../components/MediaDiary";
import { useContext } from "react";
import { ContextState } from "../utils/store";

function App() {
  const { user, logout } = useUser();
  const state = useContext(ContextState);
  const router = useRouter();

  console.log(state);

  return (
    <>
      <Container maxWidth={{ base: "xl", md: "lg" }}>
        <Box pt={3} mt={16} mx="auto">
          {!user ? (
            <Button onClick={() => router.push("/login")}>
              External Login
            </Button>
          ) : (
            <MediaDiary />
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
