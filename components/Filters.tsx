import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/core";
import React, { useContext, useState } from "react";
import { MediaTypes } from "../config/mediaTypes";
import { ContextDispatch, ContextState } from "../config/store";
import AlbumIcon from "./Icons/AlbumIcon";
import FilmIcon from "./Icons/FilmIcon";
import LogoIcon from "./Icons/LogoIcon";
import TvIcon from "./Icons/TvIcon";

function Sidebar({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { filterBy } = useContext(ContextState);
  const dispatch = useContext(ContextDispatch);
  const [localFilter, setLocalFilter] = useState(filterBy);

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
            <Text fontSize="xl" fontWeight="medium" mb={2}>
              MediaTypes
            </Text>
            <HStack align="flex-start">
              <IconButton
                variant={localFilter.includes("album") ? undefined : "outline"}
                colorScheme="purple"
                aria-label="Filter by Album"
                onClick={() => modifyFilter("album")}
                icon={<AlbumIcon />}
                size="lg"
              />
              <IconButton
                variant={localFilter.includes("movie") ? undefined : "outline"}
                colorScheme="purple"
                aria-label="Filter by Movie"
                onClick={() => modifyFilter("movie")}
                icon={<FilmIcon />}
                size="lg"
              />
              <IconButton
                variant={localFilter.includes("tv") ? undefined : "outline"}
                colorScheme="purple"
                aria-label="Filter by TV"
                onClick={() => modifyFilter("tv")}
                icon={<TvIcon />}
                size="lg"
              />
            </HStack>
            <Divider my={4} />
            <Button
              onClick={() => {
                dispatch({ type: "filter", payload: localFilter });
                return onClose();
              }}
            >
              Save
            </Button>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );

  function modifyFilter(e: MediaTypes) {
    return setLocalFilter((currentFilter) =>
      currentFilter.includes(e)
        ? currentFilter.filter((item) => item !== e)
        : [...currentFilter, e]
    );
  }
}

export default Sidebar;
