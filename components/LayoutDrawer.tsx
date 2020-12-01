import {
  Text,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerProps,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import type { PropsWithChildren } from "react";
import { useMDDispatch } from "../config/store";
import LogoIcon from "./Icons/LogoIcon";
import { useRouter } from "next/router";

function LayoutDrawer({
  children,
  refHook,
  isRoute,
  placement = "right",
  ...rest
}: PropsWithChildren<unknown> & {
  refHook?: RefObject<HTMLInputElement> | undefined;
  isRoute?: boolean;
  placement?: DrawerProps["placement"];
}): JSX.Element {
  const router = useRouter();
  const dispatch = useMDDispatch();
  return (
    <Drawer
      onClose={() => {
        dispatch({ type: "state", payload: { key: "view", value: "" } });
        if (isRoute) {
          router.push("/home");
        }
      }}
      isOpen={true}
      size="full"
      placement={placement}
      initialFocusRef={refHook}
      {...rest}
    >
      <DrawerOverlay zIndex={2}>
        <DrawerContent>
          <DrawerHeader>
            <Flex align="center">
              <LogoIcon boxSize={5} mr={1} />
              <Text
                fontSize={{ base: "md", md: "xl" }}
                color="purple.700"
                fontWeight="medium"
                cursor="pointer"
              >
                mediaDiary
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default LayoutDrawer;
