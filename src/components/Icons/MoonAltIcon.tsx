import React from "react";
import type { IconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

export default function MoonAltIcon(props: IconProps): JSX.Element {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </Icon>
  );
}
