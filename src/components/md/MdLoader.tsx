import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import Layout from "../layouts/Layout";
import MdSpinner from "./MdSpinner";

function MdLoader(): JSX.Element {
  return (
    <Layout>
      <Flex height="90vh" justifyContent="center" alignItems="center">
        <Grid alignItems="center" justifyItems="center">
          <MdSpinner />
        </Grid>
      </Flex>
    </Layout>
  );
}
export default MdLoader;
