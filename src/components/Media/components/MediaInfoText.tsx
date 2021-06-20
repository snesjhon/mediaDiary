import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  title: string;
  text: string;
}

export default function MediaInfoText({ title, text }: Props): JSX.Element {
  return (
    <Box>
      <Text fontWeight={500} fontSize="sm">
        {title}
      </Text>
      <Text fontWeight="bold" fontSize="lg">
        {text}
      </Text>
    </Box>
  );
}
