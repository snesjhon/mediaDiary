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
  calendar: IconRef.IconCalendar,
  repeat: IconRef.IconRepeat
};

const Icon = props => {
  const {
    name = "film",
    stroke = "var(--primary)",
    height = "25px",
    width = "25px",
    ...other
  } = props;
  return (
    <Box
      as={iconComponents[name]}
      stroke={stroke}
      height={height}
      width={width}
      {...other}
    />
  );
};

export default Icon;
