import { HomeIcon, BookmarkIcon, ActivityIcon } from "@/icons";
import { SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import { ContentSidebarButton, ContentSidebarFooter } from ".";
import { useMDDispatch } from "../../../../../config/store";
import useFuegoUser from "../../../../../fuego/useFuegoUser";

export default function ContentSidebarDesktop(): JSX.Element {
  const { user } = useFuegoUser();
  const dispatch = useMDDispatch();

  return (
    <Box pr={8}>
      <Box position="sticky" top="3rem" pt={6}>
        <VStack spacing={6} align="flex-start">
          <Box>
            <ContentSidebarButton title="Home" Icon={HomeIcon} route="/home" />
          </Box>
          <Box>
            <ContentSidebarButton
              title="Bookmarks"
              Icon={BookmarkIcon}
              route="/bookmarks"
            />
          </Box>
          <Box>
            <ContentSidebarButton
              title="Activity"
              Icon={ActivityIcon}
              route="/activity"
            />
          </Box>
          <Box>
            <ContentSidebarButton
              title="Settings"
              Icon={SettingsIcon}
              route="/settings"
            />
          </Box>
        </VStack>
        <Flex mt={12} mr={6}>
          <Button
            colorScheme="purple"
            onClick={() =>
              dispatch({
                type: "state",
                payload: { key: "view", value: "search" },
              })
            }
            px={8}
            leftIcon={<SearchIcon boxSize={4} />}
          >
            Search
          </Button>
        </Flex>
      </Box>
      <Box position="fixed" bottom="2rem">
        {user && <ContentSidebarFooter />}
      </Box>
    </Box>
  );
}
