import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, VStack } from "@chakra-ui/react";
import React from "react";
import { useMDDispatch } from "../config/store";

function SidebarDesktop(): JSX.Element {
  const dispatch = useMDDispatch();
  return (
    <Box pr={8}>
      <Box position="sticky" top="4rem">
        <VStack spacing={6} align="flex-start">
          <Button variant="ghost" size="lg" leftIcon={<SettingsIcon />}>
            Home
          </Button>
          <Button variant="ghost" size="lg" leftIcon={<SettingsIcon />}>
            Stats
          </Button>
          <Button variant="ghost" size="lg" leftIcon={<SettingsIcon />}>
            Settings
          </Button>
          <Button
            colorScheme="purple"
            px={10}
            onClick={() =>
              dispatch({
                type: "state",
                payload: { key: "view", value: "search" },
              })
            }
          >
            Add Media
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default SidebarDesktop;
