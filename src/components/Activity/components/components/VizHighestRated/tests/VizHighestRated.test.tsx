import React from "react";
import { Image } from "@chakra-ui/react";
import type { MediaDiaryWithId } from "@/types";
import VizHighestRated from "..";
import { mountWithContext } from "@/src/tests";

const list: MediaDiaryWithId[] = [
  {
    mediaId: "502033",
    releasedDecade: 2020,
    type: "movie",
    artist: "Darius Marder",
    id: "rflYmAlsjXQT1lEnnWSl",
    title: "Sound of Metal",
    releasedDate: "2020-11-20T08:00:00.000Z",
    releasedYear: 2020,
    bookmark: false,
    memory: true,
    addedDate: "2021-01-18T06:57:41.259Z",
    loggedBefore: false,
    rating: 5,
    poster: "y89kFMNYXNKMdlZjR2yg7nQtcQH",
    genre: "drama",
    diaryYear: 2021,
    diaryDate: "2021-01-18T06:57:32.359Z",
    diary: true,
    search_title: [
      "sound of metal",
      "s",
      "so",
      "sou",
      "soun",
      "sound",
      "sound ",
      "sound o",
      "sound of",
      "sound of ",
      "sound of m",
      "sound of me",
      "sound of met",
      "sound of meta",
      "sound of metal",
      "d",
      "da",
      "dar",
      "dari",
      "dariu",
      "darius",
      "darius ",
      "darius m",
      "darius ma",
      "darius mar",
      "darius mard",
      "darius marde",
      "darius marder",
    ],
  },
  {
    diaryYear: 2020,
    releasedDate: "2020-10-15T07:00:00.000Z",
    rating: 5,
    genre: "drama",
    artist: "Thomas Schlamme",
    bookmark: false,
    memory: true,
    releasedYear: 2020,
    id: "qbAy064cof5c4rJawTSE",
    type: "movie",
    mediaId: "753563",
    addedDate: "2020-12-24T09:01:28.088Z",
    loggedBefore: false,
    releasedDecade: 2020,
    poster: "wmqqLKSm7d6Wwjupm4sOUodnAg9",
    title: "A West Wing Special to Benefit When We All Vote",
    diaryDate: "2020-10-17T07:00:00.000Z",
    diary: true,
    search_title: [
      "a west wing special to benefit when we all vote",
      "a",
      "a ",
      "a w",
      "a we",
      "a wes",
      "a west",
      "a west ",
      "a west w",
      "a west wi",
      "a west win",
      "a west wing",
      "a west wing ",
      "a west wing s",
      "a west wing sp",
      "a west wing spe",
      "a west wing spec",
      "a west wing speci",
      "a west wing specia",
      "a west wing special",
      "a west wing special ",
      "a west wing special t",
      "a west wing special to",
      "a west wing special to ",
      "a west wing special to b",
      "a west wing special to be",
      "a west wing special to ben",
      "a west wing special to bene",
      "a west wing special to benef",
      "a west wing special to benefi",
      "a west wing special to benefit",
      "a west wing special to benefit ",
      "a west wing special to benefit w",
      "a west wing special to benefit wh",
      "a west wing special to benefit whe",
      "a west wing special to benefit when",
      "a west wing special to benefit when ",
      "a west wing special to benefit when w",
      "a west wing special to benefit when we",
      "a west wing special to benefit when we ",
      "a west wing special to benefit when we a",
      "a west wing special to benefit when we al",
      "a west wing special to benefit when we all",
      "a west wing special to benefit when we all ",
      "a west wing special to benefit when we all v",
      "a west wing special to benefit when we all vo",
      "a west wing special to benefit when we all vot",
      "a west wing special to benefit when we all vote",
      "t",
      "th",
      "tho",
      "thom",
      "thoma",
      "thomas",
      "thomas ",
      "thomas s",
      "thomas sc",
      "thomas sch",
      "thomas schl",
      "thomas schla",
      "thomas schlam",
      "thomas schlamm",
      "thomas schlamme",
    ],
  },
];

describe("<VizHighestRated />", () => {
  it("capitalizes TV", () => {
    const wrapper = mountWithContext(
      <VizHighestRated list={[]} mediaType="tv" />
    );
    expect(wrapper).toContainReactText("TV");
  });

  it("doesnt capitalize other media", () => {
    const wrapper = mountWithContext(
      <VizHighestRated list={[]} mediaType="album" />
    );
    expect(wrapper).toContainReactText("Album");
    expect(wrapper).not.toContainReactText("ALBUM");
  });

  it("shows two images from the list", () => {
    const wrapper = mountWithContext(
      <VizHighestRated list={list} mediaType="movie" />
    );
    expect(wrapper).toContainReactComponentTimes(Image, 2);
    expect(wrapper).not.toContainReactComponentTimes(Image, 3);

    const imgComponent = wrapper.findAll(Image);
    expect(imgComponent[0]).toHaveReactProps({
      src: "https://image.tmdb.org/t/p/w500/y89kFMNYXNKMdlZjR2yg7nQtcQH.jpg",
    });
  });
});
