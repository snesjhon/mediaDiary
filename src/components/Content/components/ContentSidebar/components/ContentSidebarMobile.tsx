import { HomeIcon, BookmarkIcon, ActivityIcon, LayersIcon } from "@/icons";
import { MdLogo } from "@/md";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { ContentSidebarButton, ContentSidebarFooter } from ".";

export default function ContentSidebarMobile({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay sx={{ zIndex: 2 }}>
        <DrawerContent maxW={{ base: "60%", sm: "18rem" }}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={3}>
            <MdLogo title="mediaDiary" />
          </DrawerHeader>
          <DrawerBody mt={4}>
            <VStack spacing={6} align="flex-start">
              <ContentSidebarButton
                title="Home"
                route="/home"
                Icon={HomeIcon}
              />
              <ContentSidebarButton
                title="Memories"
                route="/memories"
                Icon={LayersIcon}
              />
              <ContentSidebarButton
                title="Bookmarks"
                route="/bookmarks"
                Icon={BookmarkIcon}
              />
              <ContentSidebarButton
                title="Activity"
                route="/activity"
                Icon={ActivityIcon}
              />
              <ContentSidebarButton
                title="Settings"
                route="/settings"
                Icon={SettingsIcon}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter justifyContent="flex-start">
            <ContentSidebarFooter />
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
