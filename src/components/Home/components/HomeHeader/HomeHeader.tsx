import { useMDState } from "@/config";
import { FiltersIcon, GridIcon, ListIcon } from "@/icons";
import Filters from "@/src/components/Filters";
import { ChevronDownIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import type { SortType, ViewOptions } from "../../config";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
  view: ViewOptions;
}

export default function HomeHeader({
  sortType,
  onChange,
  view,
}: Props): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { diaryFilters } = useMDState();
  const { colorMode } = useColorMode();
  const hasFilters = [
    !!diaryFilters?.diaryYear,
    !!diaryFilters?.genre,
    !!diaryFilters?.loggedBefore?.toString(),
    !!diaryFilters?.mediaType,
    !!diaryFilters?.rating,
    !!diaryFilters?.releasedDecade,
    !!diaryFilters?.releasedYear,
  ];
  const hasFiltersCount = hasFilters.filter(Boolean).length;
  const filterComma = hasFiltersCount > 1 ? ", " : "";

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
                {hasFiltersCount > 0 && diaryFilters && (
                  <Flex alignItems="center" mr="4">
                    <Text color="gray.500" fontSize="sm" mr="2">
                      Filtered By:
                    </Text>
                    <Text fontSize="sm" fontWeight="bold">
                      {
                        <>
                          {diaryFilters.diaryYear && `Year${filterComma}`}
                          {diaryFilters.genre && `Genre${filterComma}`}
                          {diaryFilters.loggedBefore?.toString() &&
                            `Logged Before${filterComma}`}
                          {diaryFilters.mediaType && `Media Type${filterComma}`}
                          {diaryFilters.rating && `Rating`}
                        </>
                      }
                    </Text>
                  </Flex>
                )}
                <Text color="gray.500" fontSize="sm" mr="-1">
                  Sorted By:
                </Text>
                <Menu closeOnSelect={false}>
                  <MenuButton as={Button} variant="ghost" size="sm" pr="1">
                    {sortType.type === "diaryDate" && "Diary Added"}
                    {sortType.type === "addedDate" && "When Rated"}
                    <ChevronDownIcon boxSize="6" mb="1" />
                  </MenuButton>
                  <MenuList minWidth="240px">
                    <MenuOptionGroup
                      defaultValue={sortType.sort}
                      title="Order"
                      type="radio"
                    >
                      <MenuItemOption
                        value="asc"
                        onClick={() => onChange({ ...sortType, sort: "asc" })}
                      >
                        Ascending
                      </MenuItemOption>
                      <MenuItemOption
                        value="desc"
                        onClick={() => onChange({ ...sortType, sort: "desc" })}
                      >
                        Descending
                      </MenuItemOption>
                    </MenuOptionGroup>
                    <MenuDivider />
                    <MenuOptionGroup
                      title="Sort Type"
                      type="radio"
                      defaultValue={sortType.type}
                    >
                      <MenuItemOption
                        value="diaryDate"
                        onClick={() =>
                          onChange({ ...sortType, type: "diaryDate" })
                        }
                      >
                        Diary Added
                      </MenuItemOption>
                      <MenuItemOption
                        value="addedDate"
                        onClick={() =>
                          onChange({ ...sortType, type: "addedDate" })
                        }
                      >
                        When Rated
                      </MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </Flex>
              <IconButton
                icon={view.options === "list" ? <ListIcon /> : <GridIcon />}
                aria-label="filter"
                size="sm"
                variant="outline"
                onClick={() =>
                  view.onChange(view.options === "list" ? "grid" : "list")
                }
              />
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
