import { SettingsIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useIsBreakpoint } from "../utils/helpers";
import ActivityIcon from "./Icons/ActivityIcon";
import HomeIcon from "./Icons/HomeIcon";
import LogoIcon from "./Icons/LogoIcon";
import { SidebarButton, SidebarFooter } from "./SidebarContent";

function Sidebar({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const isSm = useIsBreakpoint("sm");
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay sx={{ zIndex: 2 }}>
        <DrawerContent maxW={isSm ? "50%" : "70%"}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={3}>
            <Flex alignItems="center">
              <LogoIcon boxSize={5} mr={1} />
              <Text color="purple.700" fontWeight="medium">
                mediaDiary
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody mt={4}>
            <VStack spacing={6} align="flex-start">
              <SidebarButton title="Home" route="/home" Icon={HomeIcon} />
              <SidebarButton
                title="Activity"
                route="/activity"
                Icon={ActivityIcon}
              />
              <SidebarButton
                title="Settings"
                route="/settings"
                Icon={SettingsIcon}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter justifyContent="flex-start">
            <SidebarFooter />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default Sidebar;
