import dayjs from "dayjs";
import React, { useState } from "react";
import type { Dispatch } from "react";
import type { MDbTV } from "../../types/typesMDb";
import {
  MediaAbout,
  MediaCast,
  MediaContainer,
  MediaEdit,
  MediaEditEpisodes,
  MediaEditSeasons,
  MediaHeader,
  MediaInfo,
  MediaInfoButton,
  MediaInfoText,
  MediaPoster,
  MediaRating,
} from "./components";
import type { LogActions, LogState } from "../../config/storeLog";
import { Button, Flex, Text } from "@chakra-ui/react";

interface Props {
  data: MDbTV;
  diaryDate?: string | null;
  rating?: number;
  releasedDate?: string;
  poster?: string;
  edit?: {
    dispatch: Dispatch<LogActions>;
    fields: LogState;
  };
  seasonInfo?: {
    season?: number;
    episodes?: number;
  };
  handleSeasonSelected?: (props: {
    season?: number;
    episodes?: number;
    poster: string;
  }) => void;
}

export default function MediaTV({
  data,
  diaryDate,
  rating,
  releasedDate,
  poster,
  seasonInfo,
  edit,
  handleSeasonSelected,
}: Props): JSX.Element {
  const [showEpisodes, setShowEpisodes] = useState(false);
  const {
    credits,
    genres,
    poster_path,
    tagline,
    overview,
    homepage,
    first_air_date,
    original_name,
    seasons,
  } = data;

  const whereToWatch = data["watch/providers"]?.results["US"]?.link;

  const artist =
    credits &&
    credits.crew &&
    credits.crew.find((e) => e.job === "Director")?.name;

  const mediaDate =
    seasonInfo?.season && seasonInfo.season !== -1 && seasons
      ? seasons[seasonInfo.season].air_date
      : releasedDate ?? first_air_date;

  return (
    <>
      <MediaHeader artist={artist} title={original_name} />
      <MediaContainer>
        <MediaPoster poster={poster ?? poster_path} type="tv" />
        <MediaInfo>
          {diaryDate && (
            <MediaInfoText
              title="Date"
              text={dayjs(diaryDate).format("MMM D, YYYY")}
            />
          )}
          {rating && <MediaRating rating={rating} />}
          {seasonInfo?.season && seasonInfo.season !== -1 && (
            <MediaInfoText
              title="Season"
              text={seasonInfo.season.toLocaleString()}
            />
          )}
          {mediaDate && (
            <MediaInfoText
              title="Released"
              text={new Date(mediaDate).toLocaleDateString("en-us", {
                year: "numeric",
              })}
            />
          )}
          {genres && <MediaInfoText title="Genre" text={genres[0].name} />}

          <Flex justifyContent="space-between">
            {whereToWatch && (
              <MediaInfoButton
                title="Where to Watch"
                link={data["watch/providers"].results["US"].link}
              />
            )}
            {homepage && <MediaInfoButton title="Home Page" link={homepage} />}
          </Flex>
        </MediaInfo>
      </MediaContainer>
      {edit ? (
        <>
          <MediaEdit dispatch={edit.dispatch} fields={edit.fields} />
          {seasonInfo && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text flex="1">Season</Text>
              {seasonInfo?.episodes && (
                <Button
                  size="sm"
                  colorScheme="purple"
                  mr={3}
                  variant="link"
                  onClick={() => setShowEpisodes(!showEpisodes)}
                >
                  + Episodes
                </Button>
              )}
              {seasons && handleSeasonSelected ? (
                <MediaEditSeasons
                  handleSeasonSelected={handleSeasonSelected}
                  poster={poster ?? poster_path}
                  season={seasonInfo?.season}
                  seasons={seasons}
                />
              ) : (
                <div>{seasonInfo.season}</div>
              )}
            </Flex>
          )}
          {seasonInfo?.episodes && showEpisodes && (
            <MediaEditEpisodes
              dispatch={edit.dispatch}
              fields={edit.fields}
              episodes={seasonInfo.episodes}
            />
          )}
        </>
      ) : (
        <>
          {overview && <MediaAbout overview={overview} tagline={tagline} />}
          {credits && credits.cast && <MediaCast cast={credits.cast} />}
        </>
      )}
    </>
  );
}
