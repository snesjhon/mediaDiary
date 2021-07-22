import type { TVSeason } from "@/types";
import { parsePosterUrl } from "@/utils";
import { Box } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/react";
import React from "react";

interface Props {
  seasons: TVSeason[];
  season?: number;
  poster: string;
  handleSeasonSelected: (props: {
    season?: number;
    episodes?: number;
    poster: string;
  }) => void;
}

export default function MediaEditSeasons({
  seasons,
  season,
  poster,
  handleSeasonSelected,
}: Props): JSX.Element {
  return (
    <Box w="30%">
      <Select
        size="sm"
        value={season}
        onChange={(valueChange) => {
          if (seasons) {
            const seasonIndex = seasons.findIndex(
              (e) => e.season_number === parseInt(valueChange.target.value)
            );
            const selectSeason = seasons[seasonIndex];
            handleSeasonSelected({
              season: selectSeason.season_number,
              episodes: selectSeason.episode_count,
              poster:
                selectSeason.poster_path && selectSeason.poster_path !== null
                  ? parsePosterUrl(selectSeason.poster_path, "tv")
                  : poster,
            });
          }
          return;
        }}
      >
        {seasons.map((e) => (
          <option key={`season_${e.season_number}`} value={e.season_number}>
            {e.season_number}
          </option>
        ))}
      </Select>
    </Box>
  );
}
