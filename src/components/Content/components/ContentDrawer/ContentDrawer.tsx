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
import { useMDDispatch } from "../../../../config/store";
import MdLogo from "../../../md/MdLogo";

export default function ContentDrawer({
  children,
  refHook,
  placement = "right",
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
          {showHeader && (
            <DrawerHeader>
              <MdLogo title="mediaDiary" />
              <DrawerCloseButton />
            </DrawerHeader>
          )}
          {children}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );

  function onClose() {
    dispatch({ type: "view", payload: "md" });
  }
}
