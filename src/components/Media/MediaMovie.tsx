import dayjs from "dayjs";
import React from "react";
import type { Dispatch } from "react";
import {
  MediaAbout,
  MediaCast,
  MediaContainer,
  MediaEdit,
  MediaHeader,
  MediaInfo,
  MediaInfoButton,
  MediaInfoText,
  MediaLinks,
  MediaLogRating,
  MediaPoster,
  MediaRating,
} from "./components";
import { Divider } from "@chakra-ui/react";
import type { MDbMovie, MediaDiary } from "@/types";
import type { LogRatingActions, LogRatingState } from "../Log/config";
import type { LogActions, LogState } from "@/config";

interface Props {
  data: MDbMovie;
  diaryDate?: MediaDiary["diaryDate"];
  rating?: MediaDiary["rating"];
  edit?: {
    dispatch: Dispatch<LogActions>;
    fields: LogState;
  };
  logRating?: {
    dispatch: Dispatch<LogRatingActions>;
    fields: LogRatingState;
  };
}

export default function MediaMovie({
  data,
  diaryDate,
  rating,
  edit,
  logRating,
}: Props): JSX.Element {
  const {
    credits,
    genres,
    title,
    poster_path,
    release_date,
    tagline,
    overview,
    homepage,
  } = data;

  const whereToWatch = data["watch/providers"]?.results["US"]?.link;

  const artist =
    credits &&
    credits.crew &&
    credits.crew.find((e) => e.job === "Director")?.name;

  const showInfo = !edit && !logRating;
  return (
    <>
      <MediaHeader artist={artist} title={title} />
      <MediaContainer>
        <MediaPoster poster={poster_path} type="movie" />
        {showInfo && (
          <MediaInfo>
            {diaryDate && (
              <MediaInfoText
                title="Date"
                text={dayjs(diaryDate).format("MMM D, YYYY")}
              />
            )}
            {rating && rating > 0 ? <MediaRating rating={rating} /> : null}
            {release_date && (
              <MediaInfoText
                title="Released"
                text={new Date(release_date).toLocaleDateString("en-us", {
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
