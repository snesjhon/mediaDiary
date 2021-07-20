import dayjs from "dayjs";
import React from "react";
import type { Dispatch } from "react";
import { MEDIA_LOGGED_BEFORE } from "../../../config/contants";
import type { LogActions, LogState } from "../../../config/storeLog";
import { StarIcon } from "@chakra-ui/icons";
import { Flex, Box, Divider } from "@chakra-ui/layout";
import { Input, Checkbox, Text } from "@chakra-ui/react";
import Rating from "react-rating";
import { StarEmptyIcon } from "@/icons";

interface Props {
  dispatch: Dispatch<LogActions>;
  fields: LogState;
}
export default function MediaEdit({ dispatch, fields }: Props): JSX.Element {
  const { diaryDate, loggedBefore, rating } = fields;
  return (
    <>
      {diaryDate && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text>Date</Text>
          <Box>
            <Input
              size="sm"
              type="date"
              required
              value={dayjs(diaryDate).format("YYYY-MM-DD")}
              max={dayjs().format("YYYY-MM-DD")}
              onChange={(e) =>
                dispatch({
                  type: "state",
                  payload: {
                    key: "diaryDate",
                    value: dayjs(e.target.value).toISOString(),
                  },
                })
              }
            />
          </Box>
        </Flex>
      )}
      <Divider my={2} />
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
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{MEDIA_LOGGED_BEFORE["movie"]}</Text>
        <Checkbox
          colorScheme="purple"
          isChecked={loggedBefore}
          onChange={() =>
            dispatch({
              type: "state",
              payload: { key: "loggedBefore", value: !loggedBefore },
            })
          }
        />
      </Flex>
    </>
  );
}
