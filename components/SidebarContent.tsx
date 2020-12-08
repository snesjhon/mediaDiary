import {
  Text,
  Avatar,
  Box,
  Button,
  Flex,
  IconProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { useAuth, useLogout } from "../utils/auth";
import { useIsBreakpoint } from "../utils/helpers";

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
  const isSm = useIsBreakpoint("sm");
  return (
    <Button
      variant="ghost"
      leftIcon={<Icon mb="2px" />}
      fontSize={isSm ? "xl" : undefined}
      bg={router.pathname === route ? "purple.50" : undefined}
      _hover={{
        bg: "purple.50",
      }}
      _active={{
        bg: "purple.100",
      }}
      onClick={() => router.push(route)}
    >
      {title}
    </Button>
  );
}

export function SidebarFooter(): JSX.Element | null {
  const { user } = useAuth();
  const logout = useLogout();
  return user ? (
    <Menu autoSelect={false}>
      <MenuButton _hover={{ bg: "purple.100" }} p={2} rounded="md">
        <Flex alignItems="center">
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
        <MenuItem onClick={() => logout()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : null;
}
