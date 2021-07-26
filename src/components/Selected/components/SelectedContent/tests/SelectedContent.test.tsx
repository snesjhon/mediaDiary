import dayjs from "dayjs";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import MdLoader from "../../../../md/MdLoader";
import { MediaMovie, MediaSpotify, MediaTV } from "../../../../Media";
import { fuegoBookmarkAdd } from "@/fuego";
import {
  mockMovieFetchData,
  mockMovieSelected,
} from "../../../../../utils/test-utils";
import { mountWithDrawerSuspense } from "../../../../../utils/test-utils/mountWith";
import SelectedContent from "..";

let mockIsLoading = true;
jest.mock("../../../../../config/useDataFetch", () => {
  return jest.fn(() => ({
    data: mockMovieFetchData,
    isLoading: mockIsLoading,
  }));
});

jest.mock("../../../../../fuego/useFuegoUser", () => {
  return jest.fn(() => ({
    user: {
      uid: 1,
    },
  }));
});

jest.mock("../../../../../fuego/fuegoBookmarks", () => ({
  fuegoBookmarkAdd: jest.fn(),
}));

describe("<SelectedContent /> ", () => {
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
    jest.useFakeTimers("modern");
    // In the github test runner, and local runner. The TZ is different
    // This is set at zero to have a baseline of `1970-01-01T00:00:00.000Z`
    jest.setSystemTime(0);
  });
  afterAll(() => {
    jest.useRealTimers();
  });
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
      expect(wrapper).toContainReactComponent(MediaMovie);
      const btn = wrapper.find(IconButton, { id: "selectedBookmark" });
      btn?.trigger("onClick");
      expect(fuegoBookmarkAdd).toBeCalledWith(1, {
        releasedYear: 2015,
        releasedDecade: 2010,
        addedDate: "1970-01-01T00:00:00.000Z",
        type: "movie",
        genre: "action",
        mediaId: "76341",
        poster: "8tZYtuWezp8JbcsvHYO0O46tFbo",
        artist: "George Miller",
        title: "Mad Max: Fury Road",
        releasedDate: dayjs("2015-05-13").toISOString(),
        bookmark: true,
        memory: false,
        rating: 0,
        diaryDate: false,
        diaryYear: false,
        diary: false,
        loggedBefore: false,
        search_title: [
          "mad max fury road",
          "m",
          "ma",
          "mad",
          "mad ",
          "mad m",
          "mad ma",
          "mad max",
          "mad max ",
          "mad max f",
          "mad max fu",
          "mad max fur",
          "mad max fury",
          "mad max fury ",
          "mad max fury r",
          "mad max fury ro",
          "mad max fury roa",
          "mad max fury road",
          "g",
          "ge",
          "geo",
          "geor",
          "georg",
          "george",
          "george ",
          "george m",
          "george mi",
          "george mil",
          "george mill",
          "george mille",
          "george miller",
        ],
      });
    });
  });
});
