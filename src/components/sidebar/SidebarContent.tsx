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
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import { useAuth, useLogout } from "../../config/auth";
import useIsBreakpoint from "../../utils/useIsBreakpoint";

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
