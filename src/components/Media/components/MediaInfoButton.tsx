import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Link } from "@chakra-ui/react";
import React from "react";

interface Props {
  link: string;
  title: string;
}
export default function MediaInfoButton({ link, title }: Props): JSX.Element {
  return (
    <Box>
      <Button
        as={Link}
        href={link}
        target="_blank"
        size={"sm"}
        leftIcon={<ExternalLinkIcon />}
        variant="outline"
      >
        {title}
      </Button>
    </Box>
  );
}
