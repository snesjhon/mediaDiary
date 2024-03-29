import { useFuegoUser } from "@/fuego";
import {
  BookmarkIcon,
  ActivityIcon,
  LayersIcon,
  PlusIcon,
  BookIcon,
} from "@/icons";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { ContentSidebarButton, ContentSidebarFooter } from ".";

export default function ContentSidebarDesktop(): JSX.Element {
  const { user } = useFuegoUser();
  const router = useRouter();

  return (
    <Box pr={8}>
      <Box position="sticky" top="3rem" pt={6}>
        <VStack spacing={6} align="flex-start">
          <Box>
            <ContentSidebarButton
              title="Diary"
              Icon={BookIcon}
              route="/diary"
            />
          </Box>
          <Box>
            <ContentSidebarButton
              title="Memories"
              Icon={LayersIcon}
              route="/memories"
            />
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
            onClick={() => router.push("/add")}
            px={8}
            leftIcon={<PlusIcon boxSize={6} />}
          >
            Media
          </Button>
        </Flex>
      </Box>
      <Box position="fixed" bottom="2rem">
        {user && <ContentSidebarFooter />}
      </Box>
    </Box>
  );
}
