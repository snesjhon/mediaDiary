import React from "react";
import * as IconRef from "./icons";
import Box from "./Box";

const iconComponents = {
  film: IconRef.IconFilm,
  album: IconRef.IconAlbum,
  tv: IconRef.IconTv,
  checked: IconRef.IconChecked,
  unchecked: IconRef.IconUnChecked,
  starFull: IconRef.IconStarFull,
  starEmpty: IconRef.IconStarEmpty,
  calendar: IconRef.IconCalendar
};

const Icon = props => {
  const { name, stroke, height, width, ...other } = props;
  const IconRender =
    iconComponents[name] !== undefined
      ? iconComponents[name]
      : IconRef.IconFilm;
  return (
    <Box
      as={IconRender}
      stroke={stroke}
      height={height}
      width={width}
      {...other}
    />
  );
};

export default Icon;
