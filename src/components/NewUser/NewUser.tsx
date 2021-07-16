import { LogoIcon } from "@/icons";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import React, { useEffect, useState } from "react";
import type { UserFuegoValidated } from "../../types/typesUser";
import { NewUserPreferences } from "./components";

export default function NewUser({
  user,
}: {
  user: UserFuegoValidated;
}): JSX.Element {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    if (isRedirecting) {
      destroyCookie(null, "fuegoNewUser");
      router.push("/home");
    }
  }, [isRedirecting, router]);
  return (
    <Box
      p="10"
      border="1px solid"
      borderColor="gray.500"
      borderRadius="md"
      bg="white"
    >
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
        <NewUserPreferences user={user} cb={() => setIsRedirecting(true)} />
      )}
    </Box>
  );
}
