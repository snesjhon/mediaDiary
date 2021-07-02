import React from "react";
import { MediaMovie } from "..";
import { mount } from "@shopify/react-testing";
import "@shopify/react-testing/matchers";
import jsonData from "../../../utils/test-data.json";
import { MediaHeader } from "../components";
import type { MDbMovie } from "../../../types/typesMDb";

describe("<MediaMovie />", () => {
  it("renders a MediaHeader with appropriate props", () => {
    const wrapper = mount(<MediaMovie data={jsonData as MDbMovie} />);
    expect(wrapper).toContainReactComponent(MediaHeader);

    const mediaHeaderInWrapper = wrapper.find(MediaHeader);
    expect(mediaHeaderInWrapper).toHaveReactProps({
      artist: "Steven Spielberg",
    });
  });
});
