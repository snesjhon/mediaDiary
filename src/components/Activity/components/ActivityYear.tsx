import { MdLoader } from "@/md";
import type { MediaType, MediaDiaryWithId } from "@/types";
import { useIsBreakpoint } from "@/utils";
import React from "react";
import useSWR from "swr";
import { fuegoChartYear } from "../config/fuego";
import {
  VizHighestRated,
  VizRating,
  VizReleased,
  VizGenre,
} from "./components";

export default function ActivityYear({
  uid,
  mediaType,
  year,
}: {
  uid: string;
  year: number | null;
  mediaType: MediaType | null;
}): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const { data, error } = useSWR<MediaDiaryWithId[]>(
    ["/fuego/chartYear", uid, year, mediaType],
    fuegoChartYear,
    { revalidateOnFocus: false }
  );

  if (error) {
    if (error) {
      console.error(error);
    }
    return <div>An error happened</div>;
  }

  if (data) {
    if (data && data.length < 1) {
      return <div>no data</div>;
    }
    const highestRated = data
      .filter((e) => !e.loggedBefore)
      .slice(0, isMd ? 8 : 6);

    const ratingCount = data.reduce((a, c) => {
      a[c.rating * 2] += 1;
      return a;
    }, Array(11).fill(0));

    const genreCondensed = data.reduce<{
      [key: string]: number;
    }>((a, c) => {
      const genre = c.genre;
      if (genre.includes("hip hop") || genre.includes("rap")) {
        a["hip hop"] =
          typeof a["hip hop"] !== "undefined" ? a["hip hop"] + 1 : 1;
      } else if (genre.includes("rock")) {
        a["rock"] = typeof a["rock"] !== "undefined" ? a["rock"] + 1 : 1;
      } else if (genre.includes("pop")) {
        a["pop"] = typeof a["pop"] !== "undefined" ? a["pop"] + 1 : 1;
      } else if (genre.includes("alternative")) {
        a["alternative"] =
          typeof a["alternative"] !== "undefined" ? a["alternative"] + 1 : 1;
      } else {
        a[genre] = typeof a[genre] !== "undefined" ? a[genre] + 1 : 1;
      }
      return a;
    }, {});
    const genreSorted = Object.keys(genreCondensed)
      .sort((a, b) => (genreCondensed[a] > genreCondensed[b] ? -1 : 1))
      .slice(0, 9);

    const genreList = Object.keys(genreCondensed).reduce<{
      [key: string]: number;
    }>((a, c) => {
      if (genreSorted.includes(c)) {
        a[c] = genreCondensed[c];
      } else {
        a["other"] =
          typeof a["other"] !== "undefined"
            ? a["other"] + genreCondensed[c]
            : genreCondensed[c];
      }
      return a;
    }, {});

    const yearList = data.reduce<{ [key: string]: number }>((a, c) => {
      if (typeof a[c.releasedYear] === "undefined") {
        a[c.releasedYear] = 1;
      } else {
        ++a[c.releasedYear];
      }
      return a;
    }, {});
    return (
      <>
        <VizHighestRated list={highestRated} mediaType={mediaType} />
        <VizRating list={ratingCount} />
        <VizReleased list={yearList} />
        <VizGenre list={genreList} />
      </>
    );
  }
  return <MdLoader />;
}
