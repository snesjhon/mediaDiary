import React from "react";
import useSWR from "swr";
import { fuegoChartTop6 } from "../config/fuego";
import {
  VizGenre,
  VizHighestRated,
  VizRating,
  VizReleased,
} from "./components";
import type { FilterData } from "../../Filters/config";
import { useIsBreakpoint } from "@/utils";

export default function ActivityAll({
  uid,
  list,
}: {
  uid: string;
  list: FilterData;
}): JSX.Element {
  const isMd = useIsBreakpoint("md");
  const { data, error } = useSWR(
    ["fuego/chartTop", uid, isMd ? 8 : 6],
    fuegoChartTop6,
    {
      revalidateOnFocus: false,
    }
  );

  const { rating, releasedYear, genre } = list;

  const ratingCount = Object.keys(rating).reduce<number[]>((a, c) => {
    Object.keys(rating[c]).forEach((i) => {
      a[parseInt(i)] += rating[c][i];
    });
    return a;
  }, Array(11).fill(0));

  const yearList = Object.keys(releasedYear).reduce<{
    [key: string]: number;
  }>((a, c) => {
    Object.keys(releasedYear[c]).forEach((i) => {
      if (releasedYear[c][i] > 0) {
        a[i] = releasedYear[c][i];
      }
    });
    return a;
  }, {});

  const genreCondensed = Object.keys(genre).reduce<{
    [key: string]: number;
  }>((a, c) => {
    Object.keys(genre[c]).forEach((i) => {
      const itemCount = genre[c][i];
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
          a[i] = typeof a[i] !== "undefined" ? a[i] + itemCount : genre[c][i];
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
      {data && <VizHighestRated list={data} mediaType={null} />}
      <VizRating list={ratingCount} />
      <VizReleased list={yearList} />
      <VizGenre list={genreList} />
    </>
  );
}
