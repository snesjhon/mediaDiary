import React from "react";
import IconFilm from "./icons/iconFilm";

const iconComponents = {
  film: IconFilm
};

const Icon = props => {
  const { name, stroke, height, width, ...other } = props;
  const IconRender =
    iconComponents[name] !== undefined ? iconComponents[name] : IconFilm;
  return (
    <IconRender stroke={stroke} height={height} width={width} {...other} />
  );
};

Icon.defaultProps = {
  stroke: "rgb(246, 248, 250)",
  width: "20px",
  height: "20px"
};

export default Icon;
