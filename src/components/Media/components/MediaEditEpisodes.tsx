import type { LogActions, LogState } from "@/config";
import React from "react";
import type { Dispatch } from "react";
import type { LogRatingActions, LogRatingState } from "../../Log/config";
import { Divider, SimpleGrid } from "@chakra-ui/layout";
import { Text, Checkbox } from "@chakra-ui/react";

interface Props {
  dispatch: Dispatch<LogActions> | Dispatch<LogRatingActions>;
  fields: LogState | LogRatingState;
  episodes: number;
}
export default function MediaEditEpisodes({
  fields,
  dispatch,
  episodes,
}: Props): JSX.Element {
  const { seenEpisodes } = fields;
  return (
    <>
      <Divider my={2} />
      <SimpleGrid columns={Math.floor(episodes / 3)} spacingY={3}>
        {Array.from({ length: episodes }, (_, episodeNumber: number) => (
          <Checkbox
            key={`episode_${episodeNumber + 1}`}
            value={episodeNumber + 1}
            isChecked={seenEpisodes?.includes(episodeNumber + 1)}
            colorScheme="purple"
            onChange={(e) => {
              // TODO: prevent empty episode number
              let episodeArr: number[] = [];
              if (typeof seenEpisodes !== "undefined") {
                const hasValue = seenEpisodes.includes(
                  parseInt(e.target.value)
                );
                episodeArr = hasValue
                  ? seenEpisodes.filter(
                      (filterValue) => filterValue !== parseInt(e.target.value)
                    )
                  : [parseInt(e.target.value)].concat(seenEpisodes);
              } else {
                episodeArr = [parseInt(e.target.value)];
              }

              return dispatch({
                type: "state",
                payload: {
                  key: "seenEpisodes",
                  value: episodeArr,
                },
              });
            }}
          >
            <Text fontSize="sm">{episodeNumber + 1}</Text>
          </Checkbox>
        ))}
      </SimpleGrid>
    </>
  );
}
