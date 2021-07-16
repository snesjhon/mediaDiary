import React from "react";
import type { IconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

function BookmarkIcon(props: IconProps): JSX.Element {
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
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </Icon>
  );
}

export default BookmarkIcon;
