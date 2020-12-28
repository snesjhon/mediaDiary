import React from "react";
import type { IconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

function LayersIcon(props: IconProps): JSX.Element {
  return (
    <Icon
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </Icon>
  );
}

export default LayersIcon;
