import { Button } from "@chakra-ui/react";
import React from "react";
import useDataFetch from "../../../config/useDataFetch";
import { fuegoBookmarkAdd } from "../../../fuego/fuegoBookmarks";
import {
  mockAlbumDiaryWithId,
  mockAlbumFetchData,
  mockMovieDiaryWithId,
  mockMovieFetchData,
  mockMovieSelected,
  mountWithDrawerSuspense,
} from "../../../utils/test-utils";
import MdLoader from "../../md/MdLoader";
import { MediaMovie, MediaSpotify, MediaTV } from "../../Media";
import { SelectedContent } from "../components";

let mockIsLoading = true;
// const mockType = "movie";
jest.mock("../../../config/useDataFetch", () => {
  return jest.fn(() => ({
    data: mockMovieFetchData,
    isLoading: mockIsLoading,
  }));
});

jest.mock("../../../fuego/fuegoBookmarks", () => ({
  fuegoBookmarkAdd: jest.fn(),
  // return jest.fn(() => ({
  //   data: mockMovieFetchData,
  //   isLoading: mockIsLoading,
  // }));
}));
describe("<SelectedContent /> ", () => {
  beforeEach(() => jest.resetModules());
  describe("<SelectedContent /> with albumData", () => {
    it("renders a loader, if data is loading", () => {
      mockIsLoading = true;
      const wrapper = mountWithDrawerSuspense(
        <SelectedContent
          item={mockMovieSelected}
          mutate={() => {
            null;
          }}
        />
      );
      expect(wrapper).toContainReactComponent(MdLoader);
    });

    it("renders the appropriate Media component based on Data", () => {
      mockIsLoading = false;
      const wrapper = mountWithDrawerSuspense(
        <SelectedContent
          item={mockMovieSelected}
          mutate={() => {
            null;
          }}
        />
      );
      expect(wrapper).toContainReactComponent(MediaMovie);
      expect(wrapper).not.toContainReactComponent(MediaSpotify);
      expect(wrapper).not.toContainReactComponent(MediaTV);
    });

    it("creates bookmark", () => {
      mockIsLoading = false;
      const wrapper = mountWithDrawerSuspense(
        <SelectedContent
          item={mockMovieSelected}
          mutate={() => {
            null;
          }}
        />
      );
      const btns = wrapper.findAll(Button);
      console.log(btns[btns.length - 2].debug());
      btns[btns.length - 2]?.trigger("onClick");
      expect(wrapper).toContainReactComponent(MediaMovie);
    });
  });
  // describe("<SelectedContent /> with movieData", () => {
  //   it("renders a loader, if data is loading", () => {
  //     mockIsLoading = true;
  //     const wrapper = mountWithDrawerSuspense(
  //       <SelectedContent
  //         mdData={mockMovieDiaryWithId}
  //         mutate={() => {
  //           null;
  //         }}
  //       />
  //     );
  //     expect(wrapper).toContainReactComponent(MdLoader);
  //   });

  //   it("renders the appropriate Media component based on Data", () => {
  //     mockIsLoading = false;
  //     mockType = "movie";
  //     const wrapper = mountWithDrawerSuspense(
  //       <SelectedContent
  //         mdData={mockMovieDiaryWithId}
  //         mutate={() => {
  //           null;
  //         }}
  //       />
  //     );
  //     expect(wrapper).toContainReactComponent(MediaMovie);
  //     expect(wrapper).not.toContainReactComponent(MediaSpotify);
  //     expect(wrapper).not.toContainReactComponent(MediaTV);
  //   });
  // });
});
