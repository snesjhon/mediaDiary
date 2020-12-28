import React from "react";
import useSWR from "swr";
import type { DiaryAddWithId, MediaTypes } from "../../config/types";
import { fuegoChartYear } from "../../interfaces/fuegoChartActions";
import MdLoader from "../md/MdLoader";
import ChartTop from "./ChartTop";
import { ChartVizRating, ChartVizReleased } from "./ChartViz";

function ChartYear({
  uid,
  mediaType,
  year,
}: {
  uid: string;
  year: number | null;
  mediaType: MediaTypes | null;
}): JSX.Element {
  const { data, error } = useSWR<DiaryAddWithId[]>(
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
    const highestRated = data.filter((e) => !e.loggedBefore).slice(0, 6);

    const ratingCount = data.reduce((a, c) => {
      a[c.rating * 2] += 1;
      return a;
    }, Array(11).fill(0));

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
        <ChartTop list={highestRated} />
        <ChartVizRating list={ratingCount} />
        <ChartVizReleased list={yearList} />
      </>
    );
  }
  return <MdLoader />;
}

export default ChartYear;
