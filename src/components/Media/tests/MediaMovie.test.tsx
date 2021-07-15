import React from "react";
import { MediaMovie } from "..";
import { mount } from "@shopify/react-testing";
import { MediaAbout, MediaHeader, MediaRating } from "../components";
import Rating from "react-rating";
import { mockMovieFetchData } from "../../../utils/test-utils";

jest.mock("@/utils/useIsBreakpoint", () => {
  return jest.fn(() => true);
});

describe("<MediaMovie />", () => {
  it("renders <MediaHeader /> with appropriate props", () => {
    const wrapper = mount(<MediaMovie data={mockMovieFetchData} />);
    expect(wrapper).toContainReactComponent(MediaHeader);

    const mediaHeaderInWrapper = wrapper.find(MediaHeader);
    expect(mediaHeaderInWrapper).toHaveReactProps({
      artist: "George Miller",
    });
  });

  it("renders <MediaAbout /> with appropriate props", () => {
    const wrapper = mount(<MediaMovie data={mockMovieFetchData} />);
    expect(wrapper).toContainReactComponent(MediaAbout);

    const aboutComponent = wrapper.find(MediaAbout);
    expect(aboutComponent).toHaveReactProps({
      overview:
        "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order.",
      tagline: "What a Lovely Day.",
    });
  });

  it("renders <MediaRating /> with 5 stars", () => {
    const wrapper = mount(<MediaRating rating={10} />);
    expect(wrapper).toContainReactComponent(Rating);
    const ratingComponent = wrapper.find(Rating);
    expect(ratingComponent).toHaveReactProps({ initialRating: 10 });
  });
});
