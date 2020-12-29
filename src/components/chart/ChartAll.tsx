import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import type { FilterData, MediaTypes } from "../../config/types";
import { fuegoChartTop6 } from "../../interfaces/fuegoChartActions";
import ChartTop from "./ChartTop";
import { ChartVizGenre, ChartVizRating, ChartVizReleased } from "./ChartViz";

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

  const { filterRating, filterReleasedYear, filterGenre } = list;

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

  const genreCondensed = Object.keys(filterGenre).reduce<{
    [key: string]: number;
  }>((a, c) => {
    Object.keys(filterGenre[c]).forEach((i) => {
      const itemCount = filterGenre[c][i];
      if (itemCount > 0) {
        if (i.includes("hip hop") || i.includes("rap")) {
          a["hip hop"] =
            typeof a["hip hop"] !== "undefined"
              ? a["hip hop"] + itemCount
              : itemCount;
        } else if (i.includes("rock")) {
          a["rock"] =
            typeof a["rock"] !== "undefined"
              ? a["rock"] + itemCount
              : itemCount;
        } else if (i.includes("pop")) {
          a["pop"] =
            typeof a["pop"] !== "undefined" ? a["pop"] + itemCount : itemCount;
        } else if (i.includes("alternative")) {
          a["alternative"] =
            typeof a["alternative"] !== "undefined"
              ? a["alternative"] + itemCount
              : itemCount;
        } else {
          a[i] =
            typeof a[i] !== "undefined" ? a[i] + itemCount : filterGenre[c][i];
        }
      }
    });
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

  return (
    <>
      {data && <ChartTop list={data} />}
      <ChartVizRating list={ratingCount} />
      <ChartVizReleased list={yearList} />
      <ChartVizGenre list={genreList} />
    </>
  );
}
export default ChartAll;
