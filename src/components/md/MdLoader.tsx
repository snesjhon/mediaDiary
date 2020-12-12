import { Flex, Grid, Spinner } from "@chakra-ui/react";
import React from "react";
import LogoIcon from "../icons/LogoIcon";
import Layout from "../layouts/Layout";

function MdLoader({ fullPage }: { fullPage?: boolean }): JSX.Element {
  return fullPage ? (
    <Layout>
      <LoadingPage />
    </Layout>
  ) : (
    <LoadingPage />
  );

  function LoadingPage() {
    return (
      <Flex height="90vh" justifyContent="center" alignItems="center">
        <Grid alignItems="center" justifyItems="center">
          <LogoIcon boxSize={8} sx={{ gridRow: 1, gridColumn: 1 }} />
          <Spinner
            size="xl"
            color="purple.500"
            thickness="3px"
            sx={{ gridRow: 1, gridColumn: 1 }}
          />
        </Grid>
      </Flex>
    );
  }
}
export default MdLoader;
