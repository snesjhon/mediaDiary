import { Flex } from "@chakra-ui/react";
import React from "react";
import { MdLayout, MdSpinner } from ".";

function MdLoader(): JSX.Element {
  return (
    <MdLayout>
      <Flex height="90vh" justifyContent="center" alignItems="center">
        <MdSpinner />
      </Flex>
    </MdLayout>
  );
}
export default MdLoader;
