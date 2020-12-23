import React from "react";
import type { FilterData } from "../../config/types";
import { ChartVizRating, ChartVizReleased } from "./ChartViz";

function ChartAll({ data }: { data: FilterData }): JSX.Element {
  const { filterRating, filterReleasedYear } = data;
  const ratingCount = Object.keys(filterRating).reduce<number[]>((a, c) => {
    Object.keys(filterRating[c]).forEach((i) => {
      a[parseInt(i)] += filterRating[c][i];
    });
    return a;
  }, Array(11).fill(0));

  const yearList = Object.keys(filterReleasedYear).reduce<{
    [key: string]: number;
  }>((a, c) => {
    Object.keys(filterReleasedYear[c]).forEach((i) => {
      if (filterReleasedYear[c][i] > 0) {
        a[i] = filterReleasedYear[c][i];
      }
    });
    return a;
  }, {});
  return (
    <>
      <ChartVizRating list={ratingCount} />
      <ChartVizReleased list={yearList} />
    </>
  );
}
export default ChartAll;
