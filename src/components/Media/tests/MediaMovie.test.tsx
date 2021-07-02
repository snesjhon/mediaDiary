import React from "react";
import { MediaMovie } from "..";
import { mount } from "@shopify/react-testing";
import "@shopify/react-testing/matchers";
import jsonData from "../../../utils/test-data.json";
import { MediaAbout, MediaHeader, MediaRating } from "../components";
import type { MDbMovie } from "../../../types/typesMDb";
import Rating from "react-rating";

const movieData = jsonData as MDbMovie;
describe("<MediaMovie />", () => {
  it("renders <MediaHeader /> with appropriate props", () => {
    const wrapper = mount(<MediaMovie data={movieData} />);
    expect(wrapper).toContainReactComponent(MediaHeader);

    const mediaHeaderInWrapper = wrapper.find(MediaHeader);
    expect(mediaHeaderInWrapper).toHaveReactProps({
      artist: "Steven Spielberg",
    });
  });

  it("renders <MediaAbout /> with appropriate props", () => {
    const wrapper = mount(<MediaMovie data={movieData} />);
    expect(wrapper).toContainReactComponent(MediaAbout);

    const aboutComponent = wrapper.find(MediaAbout);
    expect(aboutComponent).toHaveReactProps({
      overview:
        "When Dr. Indiana Jones – the tweed-suited professor who just happens to be a celebrated archaeologist – is hired by the government to locate the legendary Ark of the Covenant, he finds himself up against the entire Nazi regime.",
      tagline:
        "Indiana Jones - the new hero from the creators of JAWS and STAR WARS.",
    });
  });

  it("renders <MediaRating /> with 5 stars", () => {
    const wrapper = mount(<MediaRating rating={10} />);
    expect(wrapper).toContainReactComponent(Rating);
    const ratingComponent = wrapper.find(Rating);
    expect(ratingComponent).toHaveReactProps({ initialRating: 10 });
  });
});
