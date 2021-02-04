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
import React from "react";
import { useMDDispatch } from "../../config/store";
import useFuegoUser from "../../interfaces/useFuegoUser";
import useFuegoLogout from "../../interfaces/useFuegoLogout";
import ActivityIcon from "../icons/ActivityIcon";
import HomeIcon from "../icons/HomeIcon";
import { SidebarButton } from "./SidebarContent";
import PlusIcon from "../icons/PlusIcon";

function SidebarDesktop(): JSX.Element {
  const { user } = useFuegoUser();
  const logout = useFuegoLogout();
  const dispatch = useMDDispatch();
  return (
    <Box pr={8}>
      <Box position="sticky" top="3rem" pt={6}>
        <VStack spacing={6} align="flex-start">
          <Box>
            <SidebarButton title="Home" Icon={HomeIcon} route="/home" />
          </Box>
          <Box>
            <SidebarButton
              title="Activity"
              Icon={ActivityIcon}
              route="/activity"
            />
          </Box>
          <Box>
            <SidebarButton
              title="Settings"
              Icon={SettingsIcon}
              route="/settings"
            />
          </Box>
        </VStack>
        <Flex mt={12} mr={6}>
          <Button
            colorScheme="purple"
            onClick={() =>
              dispatch({
                type: "state",
                payload: { key: "view", value: "search" },
              })
            }
            pr={8}
            leftIcon={<PlusIcon boxSize={5} />}
          >
            Memory
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
