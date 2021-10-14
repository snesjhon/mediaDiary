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
  onClose,
  showHeader = true,
  ...rest
}: PropsWithChildren<unknown> & {
  refHook?: RefObject<HTMLInputElement> | undefined;
  isOpen: DrawerProps["isOpen"];
  placement?: DrawerProps["placement"];
  onClose?: DrawerProps["onClose"];
  showHeader?: boolean;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const onCloseHandler =
    typeof onClose !== "undefined" ? onClose : onCloseLocal;
  const handlers = useSwipeable({
    onSwipedRight: () => onCloseHandler(),
    onSwipedDown: () => onCloseHandler(),
    delta: 250,
  });
  const sizeType = useBreakpointValue({ base: "full", sm: "md" });

  return (
    <Drawer
      onClose={onCloseHandler}
      isOpen={isOpen}
      size={sizeType}
      placement="right"
      initialFocusRef={refHook}
      {...rest}
    >
      <DrawerOverlay zIndex="2" />
      <DrawerContent height="100%" {...handlers}>
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

  function onCloseLocal() {
    dispatch({ type: "view", payload: "md" });
  }
}
