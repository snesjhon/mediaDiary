import { Container, Box, Heading, Button, Text } from "@chakra-ui/core";
import { useRouter } from "next/router";
import useUser from "../utils/useUser";
import Header from "../components/Header";
import { useCollection } from "@nandorojo/swr-firestore";
import MediaDiary from "../components/MediaDiary";

function App() {
  const { user, logout } = useUser();
  const router = useRouter();

  return (
    <>
      <Container maxWidth="xl">
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
