import { SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import { useMDDispatch } from "../../config/store";
import useFuegoUser from "../../fuego/useFuegoUser";
import ActivityIcon from "../icons/ActivityIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import HomeIcon from "../icons/HomeIcon";
import { SidebarButton, SidebarFooter } from "./SidebarContent";

function SidebarDesktop(): JSX.Element {
  const { user } = useFuegoUser();
  const dispatch = useMDDispatch();

  return (
    <Box pr={8}>
      <Box position="sticky" top="3rem" pt={6}>
        <VStack spacing={6} align="flex-start">
          <Box>
            <SidebarButton title="Home" Icon={HomeIcon} route="/home" />
          </Box>
          <Box>
            <SidebarButton
              title="Bookmarks"
              Icon={BookmarkIcon}
              route="/bookmarks"
            />
          </Box>
          <Box>
            <SidebarButton
              title="Activity"
              Icon={ActivityIcon}
              route="/activity"
            />
          </Box>
          <Box>
            <SidebarButton
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
        {user && <SidebarFooter />}
      </Box>
    </Box>
  );
}

export default SidebarDesktop;
