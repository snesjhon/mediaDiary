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
import { useSwipeable } from "react-swipeable";

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
  const handlers = useSwipeable({
    onSwipedRight: () => onClose(),
    onSwipedDown: () => onClose(),
  });
  return (
    <Drawer
      onClose={onClose}
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
          <DrawerBody>
            <div {...handlers}>{children}</div>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );

  function onClose() {
    dispatch({ type: "state", payload: { key: "view", value: "" } });
    if (isRoute) {
      router.push("/home");
    }
  }
}

export default LayoutDrawer;
