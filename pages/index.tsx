import { Container, Box, Heading, Button, Text } from "@chakra-ui/core";
import { useRouter } from "next/router";
import useUser from "../hooks/useUser";

function App() {
  const { user, logout } = useUser();
  const router = useRouter();

  return (
    <Container>
      <Heading>asdasd</Heading>
      <Box pb={3}>something else</Box>
      {!user ? (
        <Button onClick={() => router.push("/login")}>External Login</Button>
      ) : (
        <>
          <Text>You're Logged in</Text>
          <Button onClick={logout}>Logout</Button>
        </>
      )}
    </Container>
  );
}

export default App;
