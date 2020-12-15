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
import useFuegoUser from "../../hooks/useFuegoUser";
import useIsBreakpoint from "../../hooks/useIsBreakpoint";
import useLogout from "../../hooks/useLogout";

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
  const bgColor = useColorModeValue("purple.50", "purple.800");
  const activeBg = useColorModeValue("purple.100", "purple.700");
  return (
    <Button
      variant="ghost"
      leftIcon={<Icon mb="2px" />}
      fontSize={isSm ? "xl" : undefined}
      bg={router.pathname === route ? bgColor : undefined}
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
