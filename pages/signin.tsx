import { Heading, VStack, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import MdLoader from "../src/components/md/MdLoader";
import { useSupaAuth } from "../src/supa/supaProvider";

function SignIn(): JSX.Element {
  const [loader, setLoader] = useState(false);
  const { user, signIn } = useSupaAuth();
  if (!user) {
    return (
      <>
        <Heading size="md" mb={4}>
          Signin
        </Heading>
        <VStack align="stretch" spacing={4}>
          <Button onClick={handleSignIn}>Sign In with Google</Button>
          <Button>Sign In with Twitter</Button>
        </VStack>
      </>
    );
  }
  return <MdLoader />;

  async function handleSignIn() {
    setLoader(true);
    await signIn();
    setLoader(false);
  }
}

export default SignIn;
