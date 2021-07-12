import { mountWithContext } from "../../../../../utils/test-utils/mountWith";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import { VizGenre } from "..";
import type { VizGenreProps } from "../VizGenre";

const list = {
  documentary: 7,
  comedy: 27,
  other: 53,
  drama: 31,
  action: 8,
  rock: 21,
  pop: 24,
  "hip hop": 27,
  ambient: 4,
  "sci-fi & fantasy": 12,
} as VizGenreProps["list"];

const genreArray = [
  { count: 4, filler: 49, genre: "ambient" },
  { count: 7, filler: 46, genre: "documentary" },
  { count: 8, filler: 45, genre: "action" },
  { count: 12, filler: 41, genre: "sci-fi & fantasy" },
  { count: 21, filler: 32, genre: "rock" },
  { count: 24, filler: 29, genre: "pop" },
  { count: 27, filler: 26, genre: "hip hop" },
  { count: 27, filler: 26, genre: "comedy" },
  { count: 31, filler: 22, genre: "drama" },
  { count: 53, filler: 0, genre: "other" },
];

describe("<VizGenre />", () => {
  it("displays the responsive bar ", () => {
    const wrapper = mountWithContext(<VizGenre list={list} />);
    expect(wrapper).toContainReactComponent(ResponsiveBar);
  });

  it("displays the responsive bar with appropriate data", () => {
    const wrapper = mountWithContext(<VizGenre list={list} />);
    expect(wrapper).toContainReactComponent(ResponsiveBar);

    const barComponent = wrapper.find(ResponsiveBar);
    expect(barComponent).toHaveReactProps({ data: genreArray });
  });
});
