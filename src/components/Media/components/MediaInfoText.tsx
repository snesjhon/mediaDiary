import { Box, Text } from "@chakra-ui/react";
import React from "react";
import useIsBreakpoint from "../../../utils/useIsBreakpoint";

interface Props {
  title: string;
  text: string;
}

export default function MediaInfoText({ title, text }: Props): JSX.Element {
  const isMd = useIsBreakpoint("md");
  return (
    <Box>
      <Text fontWeight={500} fontSize={isMd ? "sm" : "xs"}>
        {title}
      </Text>
      <Text fontWeight="bold" fontSize={isMd ? "lg" : "sm"}>
        {text}
      </Text>
    </Box>
  );
}
