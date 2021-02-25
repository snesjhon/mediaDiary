import { Box, Flex, Heading, Square, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { FuegoValidatedUser } from "../../types/typesMedia";
import LogoIcon from "../icons/LogoIcon";
import UserPreference from "./UserPreference";

function UserNew({ user }: { user: FuegoValidatedUser }): JSX.Element {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    if (isRedirecting) {
      router.push("/home");
    }
  }, [isRedirecting, router]);
  return (
    <Square h="80vh">
      <Box>
        <Flex alignItems="center" mb={2}>
          <LogoIcon boxSize={8} color="purple.700" />
          <Heading ml={2}>Hi, {user.displayName}</Heading>
        </Flex>
        <Text fontSize="2xl" fontWeight="semibold">
          Welcome to mediaDiary
        </Text>
        <br />
        {isRedirecting ? (
          <Text>Loading your experience</Text>
        ) : (
          <UserPreference user={user} cb={() => setIsRedirecting(true)} />
        )}
      </Box>
    </Square>
  );
}

export default UserNew;
