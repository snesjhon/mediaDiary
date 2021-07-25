import { FiltersIcon } from "@/icons";
import Filters from "@/src/components/Filters";
import { QuestionOutlineIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import {
  Tooltip,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  useDisclosure,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import type { SortType } from "../../config";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
}

export default function HomeHeader({ sortType, onChange }: Props): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode } = useColorMode();
  return (
    <>
      <Box
        position="sticky"
        top="3rem"
        pt="2"
        zIndex="1"
        bgColor={colorMode === "light" ? "white" : "gray.800"}
        borderBottomWidth="1px"
      >
        <Flex w="100%" h="100%" py={2} align="center" justify="space-between">
          <Flex alignItems="baseline">
            <Heading size="lg" mr="2">
              Diary
            </Heading>
            <Tooltip
              label={
                <Text>
                  Diary includes all rated and <br />
                  unrated Media that have dates <br />
                  attached to them.
                </Text>
              }
            >
              <QuestionOutlineIcon />
            </Tooltip>
          </Flex>
          <Flex maxW="720px" align="center">
            <HStack spacing={{ base: 0, sm: 3 }}>
              <Flex alignItems="baseline">
                <Text color="gray.500" fontSize="sm">
                  Sorted By
                </Text>
                <Menu>
                  <MenuButton as={Button} variant="ghost" size="sm" pr="1">
                    {sortType === "diaryDate" && "Diary Added"}
                    {sortType === "addedDate" && "When Rated"}
                    <ChevronDownIcon boxSize="6" mb="1" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => onChange("diaryDate")}>
                      Diary Added
                    </MenuItem>
                    <MenuItem onClick={() => onChange("addedDate")}>
                      When Rated
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <IconButton
                icon={<FiltersIcon />}
                aria-label="filter"
                size="sm"
                variant="outline"
                onClick={onOpen}
              />
            </HStack>
          </Flex>
        </Flex>
      </Box>
      <Filters isOpen={isOpen} onClose={onClose} />
    </>
  );
}
