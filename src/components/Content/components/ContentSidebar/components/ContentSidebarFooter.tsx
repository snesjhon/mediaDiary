import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import useFuegoLogout from "../../../../../fuego/useFuegoLogout";
import useFuegoUser from "../../../../../fuego/useFuegoUser";

export default function SidebarFooter(): JSX.Element | null {
  const { user } = useFuegoUser();
  const logout = useFuegoLogout();
  // const router = useRouter();
  return user ? (
    <Menu autoSelect={false}>
      <MenuButton _hover={{ bg: "purple.100" }} p={2} rounded="md">
        <Flex alignItems="center" flexDir={{ base: "column", sm: "initial" }}>
          {user.photoURL !== null && <Avatar src={user.photoURL} size="sm" />}
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
        {/* <MenuItem onClick={() => router.push("/about")}>About</MenuItem> */}
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : null;
}
