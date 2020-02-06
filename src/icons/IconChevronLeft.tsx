import * as React from "react";

function IconChevronLeft({
  width = 24,
  height = 24,
  stroke = "currentColor",
  ...rest
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

export default IconChevronLeft;
