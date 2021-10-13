import { MdLogo } from "@/md";
import { ContentFooter } from "@/src/components/Content";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import type { SortType } from "../../../../config";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
}

export default function DiarySortMobile({ sortType, onChange }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [localSort, setLocalSort] = useState<SortType["sort"]>(sortType.sort);
  const [localType, setLocalType] = useState<SortType["type"]>(sortType.type);
  return (
    <>
      <IconButton
        icon={<ArrowUpDownIcon />}
        aria-label="filter"
        size="sm"
        variant="outline"
        onClick={onOpen}
      />
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay sx={{ zIndex: 2 }} />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pt={3} pb={2}>
            <MdLogo title="Sort" />
          </DrawerHeader>
          <DrawerBody px={{ base: 0, sm: 8 }}>
            <Box p={4}>
              <Heading size="md">Order</Heading>
              <Divider mt={2} mb={4} />
              <Flex alignItems="center">
                <Select
                  onChange={(e) =>
                    setLocalSort(e.target.value as SortType["sort"])
                  }
                  value={localSort}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Select>
              </Flex>
            </Box>
            <Box p={4}>
              <Heading size="md">Sort Type</Heading>
              <Divider mt={2} mb={4} />
              <Flex alignItems="center">
                <Select
                  onChange={(e) =>
                    setLocalType(e.target.value as SortType["type"])
                  }
                  value={localType}
                >
                  <option value="diaryDate"> Diary Added</option>
                  <option value="addedDate"> When Rated</option>
                </Select>
              </Flex>
            </Box>
          </DrawerBody>
          <ContentFooter>
            {(localSort !== sortType.sort || localType !== sortType.type) && (
              <Button
                colorScheme="red"
                variant="outline"
                mr="auto"
                onClick={() => {
                  setLocalSort(sortType.sort);
                  setLocalType(sortType.type);
                }}
              >
                Reset
              </Button>
            )}
            <Button
              onClick={() => onChange({ type: localType, sort: localSort })}
              colorScheme="purple"
              variant="outline"
            >
              Save
            </Button>
          </ContentFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
