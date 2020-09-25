import {
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/core";
import React from "react";
import LogoIcon from "./Icons/LogoIcon";

function Sidebar({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay sx={{ zIndex: 2 }}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" py={3}>
            <Flex alignItems="center">
              <LogoIcon boxSize={5} mr={1} />
              <Text color="purple.700" fontWeight="medium">
                Filters
              </Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody mt={4}>
            <Text fontWeight="medium" mb={2}>
              MediaTypes
            </Text>
            <VStack align="flex-start">
              <Checkbox size="sm" colorScheme="purple">
                Albums
              </Checkbox>
              <Checkbox size="sm" colorScheme="purple" defaultIsChecked>
                Movies
              </Checkbox>
              <Checkbox size="sm" colorScheme="purple" defaultIsChecked>
                TV
              </Checkbox>
            </VStack>
            <Divider my={4} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}

export default Sidebar;
