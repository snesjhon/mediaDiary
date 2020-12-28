import React from "react";
import useSWR from "swr";
import type { FilterData, MediaTypes } from "../../config/types";
import { fuegoChartTop6 } from "../../interfaces/fuegoChartActions";
import ChartTop from "./ChartTop";
import { ChartVizRating, ChartVizReleased } from "./ChartViz";

function ChartAll({
  uid,
  list,
}: {
  uid: string;
  list: FilterData;
}): JSX.Element {
  const { data, error } = useSWR(["fuego/chartTop", uid], fuegoChartTop6, {
    revalidateOnFocus: false,
  });

  const { filterRating, filterReleasedYear } = list;
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
      {data && <ChartTop list={data} />}
      <ChartVizRating list={ratingCount} />
      <ChartVizReleased list={yearList} />
    </>
  );
}
export default ChartAll;
