import dayjs from "dayjs";
import React from "react";
import type { Dispatch } from "react";
import type { LogActions, LogState } from "../../config/storeLog";
import type { MDbMovie } from "../../types/typesMDb";
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
import type { MediaDiary } from "@/types";
import type { LogRatingActions, LogRatingState } from "../LogRating/config";

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
  return (
    <>
      <MediaHeader artist={artist} title={title} />
      <MediaContainer>
        <MediaPoster poster={poster_path} type="movie" />
        <MediaInfo>
          {diaryDate && (
            <MediaInfoText
              title="Date"
              text={dayjs(diaryDate).format("MMM D, YYYY")}
            />
          )}
          {rating ? (
            <MediaRating rating={rating} />
          ) : (
            <MediaInfoText title="Rating" text="No Rating" />
          )}
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
      </MediaContainer>
      {logRating && (
        <MediaLogRating
          dispatch={logRating.dispatch}
          fields={logRating.fields}
        />
      )}
      {edit && <MediaEdit dispatch={edit.dispatch} fields={edit.fields} />}
      {!edit && !logRating && (
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
