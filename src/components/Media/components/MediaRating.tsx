import { StarIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import Rating from "react-rating";
import StarEmptyIcon from "../../icons/StartEmptyIcon";

interface Props {
  rating: number;
}

export default function MediaRating({ rating }: Props): JSX.Element {
  return (
    <Box>
      <Text fontWeight={500} fontSize="sm">
        Rating
      </Text>
      <Text fontWeight="bold">
        <Rating
          fractions={2}
          readonly
          initialRating={rating}
          fullSymbol={<StarIcon color="purple.400" w="20px" h="20px" />}
          emptySymbol={<StarEmptyIcon stroke="purple.400" w="20px" h="20px" />}
        />
      </Text>
    </Box>
  );
}
