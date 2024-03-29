import { StarEmptyIcon } from "@/icons";
import type {
  LogRatingActions,
  LogRatingState,
} from "@/src/components/Log/config";
import { StarIcon } from "@chakra-ui/icons";
import { Flex, Box, Divider, Text } from "@chakra-ui/react";
import type { Dispatch } from "react";
import React from "react";
import Rating from "react-rating";

interface Props {
  dispatch: Dispatch<LogRatingActions>;
  fields: LogRatingState;
}

export default function MediaLogRating({
  dispatch,
  fields,
}: Props): JSX.Element {
  const { rating } = fields;
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>Rate</Text>
        <Box mt="-4px">
          <Rating
            fractions={2}
            initialRating={rating}
            fullSymbol={<StarIcon h="20px" w="20px" color="purple.500" />}
            emptySymbol={
              <StarEmptyIcon h="20px" w="20px" stroke="purple.500" />
            }
            onChange={(value) =>
              dispatch({
                type: "state",
                payload: {
                  key: "rating",
                  value,
                },
              })
            }
          />
        </Box>
      </Flex>
      <Divider my={2} />
    </>
  );
}
