import { useMDDispatch } from "@/config";
import { MdLogo } from "@/md";
import type { DrawerProps } from "@chakra-ui/react";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { PropsWithChildren, RefObject } from "react";
import React from "react";
import { useSwipeable } from "react-swipeable";

export default function ContentDrawer({
  children,
  refHook,
  isOpen,
  showHeader = true,
  ...rest
}: PropsWithChildren<unknown> & {
  refHook?: RefObject<HTMLInputElement> | undefined;
  isOpen: DrawerProps["isOpen"];
  placement?: DrawerProps["placement"];
  showHeader?: boolean;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const handlers = useSwipeable({
    onSwipedRight: () => onClose(),
    onSwipedDown: () => onClose(),
    delta: 250,
  });
  const sizeType = useBreakpointValue({ base: "full", sm: "md" });

  return (
    <Drawer
      onClose={onClose}
      isOpen={isOpen}
      size={sizeType}
      placement="right"
      initialFocusRef={refHook}
      {...rest}
    >
      <DrawerOverlay zIndex="2" />
      <DrawerContent {...handlers}>
        {showHeader && (
          <>
            <DrawerCloseButton />
            <DrawerHeader pt={3} pb={2}>
              <MdLogo title="mediaDiary" />
            </DrawerHeader>
          </>
        )}
        {children}
      </DrawerContent>
    </Drawer>
  );

  function onClose() {
    dispatch({ type: "view", payload: "md" });
  }
}
