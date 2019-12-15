/**
 * INPUT COMPONENT
 * ---
 * A simple input component
 *
 * Resources
 * - https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
 */

import * as React from "react";
import { forwardRef } from "react";
import Box, { BoxProps } from "./Box";
import styled from "styled-components";

const ImageWrapper = styled(Box)`
  max-width: 100%;
  height: auto;
`;

interface ImageProps extends BoxProps {
  alt?: string;
  src: string;
  srcset?: string;
}

type ImageRef = HTMLImageElement;

const Image = forwardRef<ImageRef, ImageProps>((props, ref) => (
  <ImageWrapper as="img" ref={ref} {...props} />
));

export default Image;
