import React from "react";
import type { ReactNode } from "react";
import type { PropsWithChildren } from "react";
import { Box, Flex, Heading, Tooltip, useColorMode } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

interface Props {
  title: string;
  description: ReactNode;
}

export default function MdContentHeader({
  children,
  description,
  title,
}: PropsWithChildren<unknown> & Props): JSX.Element {
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
            {title}
          </Heading>
          <Tooltip label={description}>
            <QuestionOutlineIcon />
          </Tooltip>
        </Flex>
        {children}
      </Flex>
    </Box>
  );
}
