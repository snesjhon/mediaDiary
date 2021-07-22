import dayjs from "dayjs";
import React, { useState } from "react";
import type { Dispatch } from "react";
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
  MediaLinks,
  MediaLogRating,
  MediaPoster,
  MediaRating,
} from "./components";
import { Button, Divider, Flex, Text } from "@chakra-ui/react";
import type { MDbTV, MediaDiary } from "@/types";
import type { LogActions, LogState } from "@/config";
import type { LogRatingActions, LogRatingState } from "../Log/config";

interface Props {
  data: MDbTV;
  diaryDate?: MediaDiary["diaryDate"];
  rating?: MediaDiary["rating"];
  releasedDate?: MediaDiary["releasedDate"];
  poster?: MediaDiary["poster"];
  artist?: MediaDiary["artist"];
  edit?: {
    dispatch: Dispatch<LogActions>;
    fields: LogState;
  };
  logRating?: {
    dispatch: Dispatch<LogRatingActions>;
    fields: LogRatingState;
  };
  seasonInfo?: {
    season?: number;
    episodes?: number;
    seenEpisodes?: number[];
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
  logRating,
  handleSeasonSelected,
  artist,
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

  const artistData =
    (credits &&
      credits.crew &&
      credits.crew.find((e) => e.job === "Director")?.name) ??
    artist;

  const mediaDate =
    seasonInfo?.season && seasonInfo.season !== -1 && seasons
      ? seasons[seasonInfo.season].air_date
      : releasedDate ?? first_air_date;

  const showInfo = !edit && !logRating;
  const showEdit = edit || logRating;
  return (
    <>
      <MediaHeader artist={artistData} title={original_name} />
      <MediaContainer>
        <MediaPoster poster={poster ?? poster_path} type="tv" />
        {showInfo && (
          <MediaInfo>
            {diaryDate && (
              <MediaInfoText
                title="Date"
                text={dayjs(diaryDate).format("MMM D, YYYY")}
              />
            )}
            {rating && rating > 0 ? <MediaRating rating={rating} /> : null}
            {seasonInfo?.season && seasonInfo.season !== -1 && (
              <MediaInfoText
                title="Season"
                text={seasonInfo.season.toLocaleString()}
              />
            )}
            {seasonInfo?.seenEpisodes && seasonInfo.seenEpisodes.length > 0 && (
              <MediaInfoText
                title="Episodes"
                text={seasonInfo.seenEpisodes.reverse().join(", ")}
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
          </MediaInfo>
        )}
      </MediaContainer>
      {logRating && (
        <MediaLogRating
          dispatch={logRating.dispatch}
          fields={logRating.fields}
        />
      )}
      {edit && <MediaEdit dispatch={edit.dispatch} fields={edit.fields} />}
      {showEdit && seasonInfo && (
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
      {showEdit && seasonInfo?.episodes && showEpisodes && (
        <>
          {edit && (
            <MediaEditEpisodes
              dispatch={edit.dispatch}
              fields={edit.fields}
              episodes={seasonInfo.episodes}
            />
          )}
          {logRating && (
            <MediaEditEpisodes
              dispatch={logRating.dispatch}
              fields={logRating.fields}
              episodes={seasonInfo.episodes}
            />
          )}
        </>
      )}
      {showInfo && (
        <>
          {overview && <MediaAbout overview={overview} tagline={tagline} />}
          <MediaLinks>
            {whereToWatch && (
              <MediaInfoButton
                title="Where to Watch"
                link={data["watch/providers"].results["US"].link}
              />
            )}
            {homepage && <MediaInfoButton title="Home Page" link={homepage} />}
          </MediaLinks>
          <Divider mt={4} mb={4} />
          {credits && credits.cast && <MediaCast cast={credits.cast} />}
        </>
      )}
    </>
  );
}
