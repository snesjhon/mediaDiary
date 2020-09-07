import { Container, Box, Heading, Button, Text } from "@chakra-ui/core";
import { useRouter } from "next/router";
import useUser from "../hooks/useUser";
import Header from "../components/Header";

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
            <>
              <Header />
              <Text>You're Logged in</Text>
              <Button onClick={logout}>Logout</Button>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
