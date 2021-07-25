import { FiltersIcon } from "@/icons";
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
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import type { SortType } from "../../config";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
}

export default function MemoriesHeader({
  sortType,
  onChange,
}: Props): JSX.Element {
  const { colorMode } = useColorMode();
  return (
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
            Memories
          </Heading>
          <Tooltip
            label={
              <Text>
                Memories include rated Media <br />
                with or without a Diary entry
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
                  {sortType === "addedDate" && "When Rated"}
                  {sortType === "rating" && "Rating"}
                  <ChevronDownIcon boxSize="6" mb="1" />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => onChange("addedDate")}>
                    When Rated
                  </MenuItem>
                  <MenuItem onClick={() => onChange("rating")}>Rating</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <IconButton
              icon={<FiltersIcon />}
              aria-label="filter"
              size="sm"
              variant="outline"
            />
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}
