import { SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useMDDispatch } from "../config/store";
import { useAuth, useLogout } from "../utils/auth";
import ActivityIcon from "./Icons/ActivityIcon";
import HomeIcon from "./Icons/HomeIcon";

function SidebarDesktop(): JSX.Element {
  const { user } = useAuth();
  const logout = useLogout();
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
              leftIcon={<ActivityIcon mb="4px" />}
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
      <Box position="fixed" bottom="2rem">
        {user && (
          <Menu autoSelect={false}>
            <MenuButton _hover={{ bg: "purple.100" }} p={2} rounded="md">
              <Flex alignItems="center">
                {user.photoURL !== null && (
                  <Avatar src={user.photoURL} size="sm" />
                )}
                <Box pl={2}>
                  {user.displayName !== null && (
                    <Text fontSize="sm" fontWeight="semibold">
                      {user.displayName}
                    </Text>
                  )}
                  {user.email !== null && (
                    <Text fontSize="xs" color="gray.600">
                      {user.email}
                    </Text>
                  )}
                </Box>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => logout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Box>
    </Box>
  );
}

export default SidebarDesktop;
