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
  MediaPoster,
  MediaRating,
} from "./components";

interface Props {
  data: MDbMovie;
  diaryDate?: string | null;
  rating?: number;
  edit?: {
    dispatch: Dispatch<LogActions>;
    fields: LogState;
  };
}

export default function MediaMovie({
  data,
  diaryDate,
  rating,
  edit,
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
          {rating && <MediaRating rating={rating} />}
          {release_date && (
            <MediaInfoText
              title="Released"
              text={new Date(release_date).toLocaleDateString("en-us", {
                year: "numeric",
              })}
            />
          )}
          {genres && <MediaInfoText title="Genre" text={genres[0].name} />}
          {whereToWatch && (
            <MediaInfoButton
              title="Where to Watch"
              link={data["watch/providers"].results["US"].link}
            />
          )}
          {homepage && <MediaInfoButton title="Home Page" link={homepage} />}
        </MediaInfo>
      </MediaContainer>
      {edit ? (
        <MediaEdit dispatch={edit.dispatch} fields={edit.fields} />
      ) : (
        <>
          {overview && <MediaAbout overview={overview} tagline={tagline} />}
          {credits && credits.cast && <MediaCast cast={credits.cast} />}
        </>
      )}
    </>
  );
}
