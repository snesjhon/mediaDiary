import { LogoIcon } from "@/icons";
import { Heading, Square } from "@chakra-ui/react";
import React from "react";

function MdStatus({ title }: { title: string }): JSX.Element {
  return (
    <Square height="80vh">
      <LogoIcon boxSize={8} color="purple.500" mr={2} />
      <Heading size="lg">{title}</Heading>
    </Square>
  );
}

export default MdStatus;
