import { StarIcon } from "@chakra-ui/icons";
import React from "react";
import Rating from "react-rating";
import type { RatingComponentProps } from "react-rating";
import type { LayoutProps } from "@chakra-ui/react";
import { StarEmptyIcon } from "@/icons";

function MdRating({
  initialRating,
  wh,
  readonly,
  onChange,
}: {
  initialRating: RatingComponentProps["initialRating"];
  wh: LayoutProps["w"] | LayoutProps["h"];
  readonly?: RatingComponentProps["readonly"];
  onChange?: RatingComponentProps["onChange"];
}): JSX.Element {
  return (
    <Rating
      fractions={2}
      readonly={readonly}
      initialRating={initialRating}
      fullSymbol={<StarIcon color="purple.400" w={wh} h={wh} />}
      emptySymbol={<StarEmptyIcon stroke="purple.400" w={wh} h={wh} />}
      onChange={onChange}
    />
  );
}

export default MdRating;
