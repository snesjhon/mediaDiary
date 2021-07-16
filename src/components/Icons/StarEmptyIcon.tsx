import React from "react";
import type { IconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

function StarEmptyIcon(props: IconProps): JSX.Element {
  return (
    <Icon
      viewBox="0 0 11 11"
      fill="none"
      strokeMiterlimit="10"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M10.5,4.1c-0.1-0.3-0.3-0.4-0.6-0.4H7.2C7.2,3.7,7.1,3.6,7,3.5L6.1,0.9C6,0.6,5.6,0.4,5.3,0.5
	C5.1,0.6,5,0.7,4.9,0.9l0,0L4,3.5c0,0.1-0.1,0.1-0.2,0.1H1.1C0.8,3.7,0.5,4,0.5,4.3c0,0.2,0.1,0.4,0.2,0.5L3,6.6
	C3,6.7,3.1,6.8,3,6.9L2.1,9.7C2,10,2.2,10.4,2.5,10.5c0.2,0.1,0.4,0,0.6-0.1l2.3-1.7c0.1-0.1,0.2-0.1,0.3,0l2.3,1.7
	c0.3,0.2,0.7,0.1,0.9-0.1C8.9,10.1,9,9.9,8.9,9.7L8,6.9C8,6.8,8,6.7,8,6.6l2.2-1.8C10.5,4.6,10.6,4.4,10.5,4.1z"
      />
    </Icon>
  );
}

export default StarEmptyIcon;
