import React from "react";
import type { IconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

function ActivityIcon(props: IconProps): JSX.Element {
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
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </Icon>
  );
}

export default ActivityIcon;
