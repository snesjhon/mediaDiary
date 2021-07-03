import type { IconProps } from "@chakra-ui/react";
import { Button, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { FunctionComponent } from "react";
import React from "react";

export default function ContentSidebarButton({
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
