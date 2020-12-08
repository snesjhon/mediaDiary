import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Text,
} from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import React, { RefObject } from "react";
import { useSwipeable } from "react-swipeable";
import { useMDDispatch } from "../../config/store";
import LogoIcon from "../Icons/LogoIcon";

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
    delta: 400,
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
    dispatch({ type: "view", payload: "md" });
  }
}

export default LayoutDrawer;
