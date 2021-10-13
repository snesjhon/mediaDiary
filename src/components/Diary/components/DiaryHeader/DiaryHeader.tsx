import { FiltersIcon, GridIcon, ListIcon } from "@/icons";
import Filters from "@/src/components/Filters";
import { useIsBreakpoint } from "@/utils";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import {
  Divider,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import type { SortType, ViewOptions } from "../../config";
import { DiarySort, DiarySortMobile } from "./components";

interface Props {
  sortType: SortType;
  onChange: (val: SortType) => void;
  view: ViewOptions;
}

export default function DiaryHeader({
  sortType,
  onChange,
  view,
}: Props): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isMd = useIsBreakpoint("md");
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
            <HStack spacing={3}>
              {isMd ? (
                <DiarySort onChange={onChange} sortType={sortType} />
              ) : (
                <DiarySortMobile onChange={onChange} sortType={sortType} />
              )}
              <IconButton
                icon={<FiltersIcon />}
                aria-label="filter"
                size="sm"
                variant="outline"
                onClick={onOpen}
              />
              <Divider orientation="vertical" h="3vh" />
              <IconButton
                icon={view.options === "list" ? <GridIcon /> : <ListIcon />}
                aria-label="filter"
                size="sm"
                variant="outline"
                onClick={() =>
                  view.onChange(view.options === "list" ? "grid" : "list")
                }
              />
            </HStack>
          </Flex>
        </Flex>
      </Box>
      <Filters isOpen={isOpen} onClose={onClose} />
    </>
  );
}
