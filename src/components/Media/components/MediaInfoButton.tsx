import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Link } from "@chakra-ui/react";
import React from "react";
import useIsBreakpoint from "../../../utils/useIsBreakpoint";

interface Props {
  link: string;
  title: string;
}
export default function MediaInfoButton({ link, title }: Props): JSX.Element {
  const isMd = useIsBreakpoint("md");
  return (
    <Box>
      <Button
        as={Link}
        href={link}
        target="_blank"
        size={isMd ? "sm" : "xs"}
        leftIcon={<ExternalLinkIcon />}
      >
        {title}
      </Button>
    </Box>
  );
}
