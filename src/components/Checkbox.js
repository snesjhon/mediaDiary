import React from "react";
import Box from "./Box";

const Checkbox = props => {
  const { checked, onChange, ...rest } = props;
  return (
    <Box {...rest}>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </Box>
  );
};

export default Checkbox;
