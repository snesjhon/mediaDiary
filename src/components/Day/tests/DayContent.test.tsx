import React from "react";
import { DayContent } from "../components";
import {
  mockAlbumDiaryWithId,
  mockAlbumFetchData,
  mockMovieDiaryWithId,
  mockMovieFetchData,
  mountWithDrawerSuspense,
} from "../../../utils/test-utils";
import MdLoader from "../../md/MdLoader";
import { MediaMovie, MediaSpotify, MediaTV } from "../../Media";

let mockIsLoading = true;
let mockType = "album";
jest.mock("../../../config/useDataFetch", () => {
  return jest.fn(() => ({
    data: mockType === "album" ? mockAlbumFetchData : mockMovieFetchData,
    isLoading: mockIsLoading,
  }));
});

describe("<DayContent /> ", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => jest.resetModules());
  describe("<DayContent /> with albumData", () => {
    it("renders a loader, if data is loading", () => {
      mockIsLoading = true;
      const wrapper = mountWithDrawerSuspense(
        <DayContent
          mdData={mockAlbumDiaryWithId}
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
        <DayContent
          mdData={mockAlbumDiaryWithId}
          mutate={() => {
            null;
          }}
        />
      );
      expect(wrapper).toContainReactComponent(MediaSpotify);
      expect(wrapper).not.toContainReactComponent(MediaMovie);
      expect(wrapper).not.toContainReactComponent(MediaTV);
    });
  });
  describe("<DayContent /> with movieData", () => {
    it("renders a loader, if data is loading", () => {
      mockIsLoading = true;
      const wrapper = mountWithDrawerSuspense(
        <DayContent
          mdData={mockMovieDiaryWithId}
          mutate={() => {
            null;
          }}
        />
      );
      expect(wrapper).toContainReactComponent(MdLoader);
    });

    it("renders the appropriate Media component based on Data", () => {
      mockIsLoading = false;
      mockType = "movie";
      const wrapper = mountWithDrawerSuspense(
        <DayContent
          mdData={mockMovieDiaryWithId}
          mutate={() => {
            null;
          }}
        />
      );
      expect(wrapper).toContainReactComponent(MediaMovie);
      expect(wrapper).not.toContainReactComponent(MediaSpotify);
      expect(wrapper).not.toContainReactComponent(MediaTV);
    });
  });
});
