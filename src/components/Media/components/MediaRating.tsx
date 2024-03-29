import { StarEmptyIcon } from "@/icons";
import { useIsBreakpoint } from "@/utils";
import { StarIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Rating from "react-rating";

interface Props {
  rating: number;
}

export default function MediaRating({ rating }: Props): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const size = isMd ? "20px" : "15px";
  return (
    <Box>
      <Text fontWeight={500} fontSize={isMd ? "sm" : "xs"}>
        Rating
      </Text>
      <Text fontWeight="bold">
        <Rating
          fractions={2}
          readonly
          initialRating={rating === -1 ? 0 : rating}
          fullSymbol={<StarIcon color="purple.400" w={size} h={size} />}
          emptySymbol={<StarEmptyIcon stroke="purple.400" w={size} h={size} />}
        />
      </Text>
    </Box>
  );
}
