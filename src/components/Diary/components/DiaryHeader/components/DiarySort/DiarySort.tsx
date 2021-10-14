import { useMDState } from "@/config";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from "@chakra-ui/react";
import React from "react";
import type { SortType } from "../../../../config";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
}

export default function DiarySort({ sortType, onChange }: Props) {
  const { diaryFilters } = useMDState();
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
              onClick={() => onChange({ ...sortType, type: "diaryDate" })}
            >
              Diary Added
            </MenuItemOption>
            <MenuItemOption
              value="addedDate"
              onClick={() => onChange({ ...sortType, type: "addedDate" })}
            >
              When Rated
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
}
