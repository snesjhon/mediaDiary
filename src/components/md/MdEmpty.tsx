import { Heading, Square } from "@chakra-ui/react";
import React from "react";
import LogoIcon from "../icons/LogoIcon";

/**
 * Provide a placeholder message when there's no records for this user
 */
function MdEmpty(): JSX.Element {
  return (
    <Square height="80vh">
      <LogoIcon boxSize={8} color="purple.500" mr={2} />
      <Heading size="lg">No Memories</Heading>
    </Square>
  );
}

export default MdEmpty;
