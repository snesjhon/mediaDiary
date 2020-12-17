import { Flex } from "@chakra-ui/react";
import React from "react";
import Layout from "../layouts/Layout";
import MdSpinner from "./MdSpinner";

function MdLoader(): JSX.Element {
  return (
    <Layout>
      <Flex height="90vh" justifyContent="center" alignItems="center">
        <MdSpinner />
      </Flex>
    </Layout>
  );
}
export default MdLoader;
