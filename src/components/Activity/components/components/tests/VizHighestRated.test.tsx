import React from "react";
import { VizHighestRated } from "..";
import type { MediaDiaryWithId } from "../../../../../types/typesMedia";
import { Image } from "@chakra-ui/react";
import { mountWithContext } from "@/utils/test-utils";

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
    addedDate: "2021-01-18T06:57:41.259Z",
    loggedBefore: false,
    rating: 5,
    poster: "y89kFMNYXNKMdlZjR2yg7nQtcQH",
    genre: "drama",
    diaryYear: 2021,
    diaryDate: "2021-01-18T06:57:32.359Z",
  },
  {
    diaryYear: 2020,
    releasedDate: "2020-10-15T07:00:00.000Z",
    rating: 5,
    genre: "drama",
    artist: "Thomas Schlamme",
    bookmark: false,
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
