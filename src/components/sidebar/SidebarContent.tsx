import type { IconProps } from "@chakra-ui/react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { FunctionComponent } from "react";
import React from "react";
import useFuegoLogout from "../../fuego/useFuegoLogout";
import useFuegoUser from "../../fuego/useFuegoUser";

export function SidebarButton({
  title,
  route,
  Icon,
}: {
  title: string;
  route: string;
  Icon: FunctionComponent<IconProps>;
}): JSX.Element {
  const router = useRouter();
  const bgColor = useColorModeValue("purple.100", "purple.500");
  const colorActiveBg = useColorModeValue("purple.600", "purple.300");
  const activeBg = useColorModeValue("purple.200", "purple.400");
  return (
    <Button
      variant="ghost"
      leftIcon={<Icon mb="2px" />}
      fontSize="xl"
      color={router.pathname === route ? colorActiveBg : undefined}
      _hover={{
        bg: bgColor,
      }}
      _active={{
        bg: activeBg,
      }}
      onClick={() => router.push(route)}
    >
      {title}
    </Button>
  );
}

export function SidebarFooter(): JSX.Element | null {
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
