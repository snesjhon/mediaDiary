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
import ActivityIcon from "../../../../icons/ActivityIcon";
import BookmarkIcon from "../../../../icons/BookmarkIcon";
import HomeIcon from "../../../../icons/HomeIcon";
import MdLogo from "../../../../md/MdLogo";

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