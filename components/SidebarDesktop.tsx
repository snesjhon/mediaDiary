import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useMDDispatch } from "../config/store";
import HomeIcon from "./Icons/HomeIcon";
import StatsIcon from "./Icons/StatsIcon";

function SidebarDesktop(): JSX.Element {
  const dispatch = useMDDispatch();
  const router = useRouter();
  return (
    <Box pr={8}>
      <Box position="sticky" top="3rem" pt={6}>
        <VStack spacing={6} align="flex-start">
          <Box>
            <Button
              variant="ghost"
              leftIcon={<HomeIcon mb="4px" />}
              px={2}
              fontSize="xl"
              bg="purple.50"
              _hover={{
                bg: "purple.50",
              }}
              _active={{
                bg: "purple.100",
              }}
              onClick={() => router.push("/home")}
            >
              Home
            </Button>
          </Box>
          <Box>
            <Button
              variant="ghost"
              leftIcon={<StatsIcon mb="4px" />}
              px={2}
              fontSize="xl"
              _hover={{
                bg: "purple.50",
              }}
              _active={{
                bg: "purple.100",
              }}
              onClick={() => router.push("/activity")}
            >
              Activity
            </Button>
          </Box>
          <Box>
            <Button
              variant="ghost"
              leftIcon={<SettingsIcon mb="2px" />}
              px={2}
              fontSize="xl"
              _hover={{
                bg: "purple.50",
              }}
              _active={{
                bg: "purple.100",
              }}
            >
              Settings
            </Button>
          </Box>
        </VStack>
        <Flex mt={12}>
          <Button
            colorScheme="purple"
            px={10}
            onClick={() =>
              dispatch({
                type: "state",
                payload: { key: "view", value: "search" },
              })
            }
          >
            Add Media
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default SidebarDesktop;
