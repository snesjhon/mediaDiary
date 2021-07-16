import { LogoIcon } from "@/icons";
import { Grid, Spinner } from "@chakra-ui/react";
import React from "react";

function MdSpinner(): JSX.Element {
  return (
    <Grid alignItems="center" justifyItems="center">
      <LogoIcon boxSize={8} sx={{ gridRow: 1, gridColumn: 1 }} />
      <Spinner
        size="xl"
        color="purple.500"
        thickness="3px"
        sx={{ gridRow: 1, gridColumn: 1 }}
      />
    </Grid>
  );
}

export default MdSpinner;
