import * as React from "react";
import * as IconRef from "./icons";
import Box, { BoxProps } from "./Box";
import styled from "styled-components";
import { system } from "styled-system";

const iconComponents = {
  film: IconRef.IconFilm,
  album: IconRef.IconAlbum,
  tv: IconRef.IconTv,
  checked: IconRef.IconChecked,
  unchecked: IconRef.IconUnChecked,
  starFull: IconRef.IconStarFull,
  starEmpty: IconRef.IconStarEmpty,
  calendar: IconRef.IconCalendar,
  repeat: IconRef.IconRepeat,
  close: IconRef.IconClose
};

export interface IconBaseProps {
  stroke?: BoxProps["color"];
  height?: string;
  width?: string;
}

interface IconWrapperProps extends BoxProps {
  name:
    | "film"
    | "album"
    | "tv"
    | "checked"
    | "unchecked"
    | "starFull"
    | "starEmpty"
    | "calendar"
    | "repeat"
    | "close";
  stroke?: BoxProps["color"];
  onClick?: () => void;
}

const IconWrapper = styled(Box)`
  ${system({
    stroke: {
      property: "stroke",
      scale: "stroke"
    }
  })}
`;

function Icon({
  height = "25px",
  width = "25px",
  name,
  ...other
}: IconWrapperProps) {
  return (
    <IconWrapper
      as={iconComponents[name]}
      height={height}
      width={width}
      {...other}
    />
  );
}

export default Icon;
