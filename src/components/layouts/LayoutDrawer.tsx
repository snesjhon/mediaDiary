import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { DrawerProps } from "@chakra-ui/react";
import type { PropsWithChildren, RefObject } from "react";
import React from "react";
import { useSwipeable } from "react-swipeable";
import { useMDDispatch } from "../../config/store";
import MdLogo from "../md/MdLogo";

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
    delta: 250,
  });
  const sizeType = useBreakpointValue({ base: "full", sm: "lg" });
  const fullHeight = useBreakpointValue({ base: true, sm: false });

  return (
    <Drawer
      onClose={onClose}
      isOpen={isOpen}
      size={sizeType}
      placement={placement}
      initialFocusRef={refHook}
      isFullHeight={fullHeight}
      {...rest}
    >
      <DrawerOverlay zIndex={2}>
        <DrawerContent {...handlers}>
          <DrawerHeader>
            <MdLogo title="mediaDiary" />
          </DrawerHeader>
          <DrawerCloseButton />
          {children}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );

  function onClose() {
    dispatch({ type: "view", payload: "md" });
  }
}

export default LayoutDrawer;
