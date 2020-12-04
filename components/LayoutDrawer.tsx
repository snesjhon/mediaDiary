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
  Container,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import type { PropsWithChildren } from "react";
import { useMDDispatch } from "../config/store";
import LogoIcon from "./Icons/LogoIcon";
import { useSwipeable } from "react-swipeable";

function LayoutDrawer({
  children,
  refHook,
  placement = "right",
  isOpen,
  ...rest
}: PropsWithChildren<unknown> & {
  refHook?: RefObject<HTMLInputElement> | undefined;
  isOpen: DrawerProps["isOpen"];
  placement?: DrawerProps["placement"];
}): JSX.Element {
  const dispatch = useMDDispatch();
  const handlers = useSwipeable({
    onSwipedRight: () => onClose(),
    onSwipedDown: () => onClose(),
  });
  return (
    <Drawer
      onClose={onClose}
      isOpen={isOpen}
      size="lg"
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
          <DrawerBody px={{ base: 6, sm: 8 }}>
            <div {...handlers}>{children}</div>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );

  function onClose() {
    dispatch({ type: "state", payload: { key: "view", value: "" } });
  }
}

export default LayoutDrawer;
