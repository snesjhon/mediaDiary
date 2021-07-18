import { IconButton } from "@chakra-ui/react";
import React from "react";
import DayContent from "..";
import {
  mockAlbumDiaryWithId,
  mockAlbumFetchData,
  mockMovieDiaryWithId,
  mockMovieFetchData,
  mountWithDrawerSuspense,
} from "../../../../../utils/test-utils";
import MdLoader from "../../../../md/MdLoader";
import { MediaMovie, MediaSpotify, MediaTV } from "../../../../Media";
import {
  fuegoBookmarkAddWithId,
  fuegoBookmarkDeleteWithId,
  fuegoBookmarkDelete,
} from "../../../config";

let mockIsLoading = false;
let mockType = "album";
jest.mock("../../../../../config/useDataFetch", () => {
  return jest.fn(() => ({
    data: mockType === "album" ? mockAlbumFetchData : mockMovieFetchData,
    isLoading: mockIsLoading,
  }));
});

jest.mock("@/utils/useIsBreakpoint", () => {
  return jest.fn(() => true);
});

jest.mock("@/fuego", () => ({
  useFuegoUser: jest.fn(() => ({
    user: {
      uid: 1,
    },
  })),
}));

jest.mock("../../../config", () => ({
  fuegoBookmarkAddWithId: jest.fn().mockImplementation(() => Promise.resolve()),
  fuegoBookmarkDelete: jest.fn().mockImplementation(() => Promise.resolve()),
  fuegoBookmarkDeleteWithId: jest
    .fn()
    .mockImplementation(() => Promise.resolve()),
}));

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

    jest.useFakeTimers("modern");
    // In the github test runner, and local runner. The TZ is different
    // This is set at zero to have a baseline of `1970-01-01T00:00:00.000Z`
    jest.setSystemTime(0);
  });
  beforeEach(() => jest.resetModules());
  afterAll(() => {
    jest.useRealTimers();
  });
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

    it("creates a bookmark", () => {
      mockIsLoading = false;
      mockType = "movie";
      const wrapper = mountWithDrawerSuspense(
        <DayContent mdData={mockMovieDiaryWithId} mutate={() => null} />
      );
      expect(wrapper).toContainReactComponent(MediaMovie);
      const btn = wrapper.find(IconButton);
      btn?.trigger("onClick");
      expect(fuegoBookmarkAddWithId).toBeCalledWith(1, "OEbKA4NXytlPRH2MkgZ1", {
        releasedYear: 2015,
        releasedDecade: 2010,
        addedDate: "2020-12-24T09:17:07.861Z",
        type: "movie",
        genre: "action",
      });
    });

    it("removes a bookmark if diaryDate or rating exist", () => {
      mockIsLoading = false;
      mockType = "movie";
      const wrapper = mountWithDrawerSuspense(
        <DayContent
          mdData={{ ...mockMovieDiaryWithId, bookmark: true }}
          mutate={() => null}
        />
      );
      expect(wrapper).toContainReactComponent(MediaMovie);
      const btn = wrapper.find(IconButton);
      btn?.trigger("onClick");
      expect(fuegoBookmarkDeleteWithId).toBeCalledWith(
        1,
        "OEbKA4NXytlPRH2MkgZ1",
        {
          releasedYear: 2015,
          releasedDecade: 2010,
          addedDate: "2020-12-24T09:17:07.861Z",
          type: "movie",
          genre: "action",
        }
      );
    });

    it("removes a bookmark if diaryDate or rating doesn't exist", () => {
      mockIsLoading = false;
      mockType = "movie";
      const wrapper = mountWithDrawerSuspense(
        <DayContent
          mdData={{
            ...mockMovieDiaryWithId,
            bookmark: true,
            rating: -1,
            diaryDate: false,
          }}
          mutate={() => null}
        />
      );
      expect(wrapper).toContainReactComponent(MediaMovie);
      const btn = wrapper.find(IconButton);
      btn?.trigger("onClick");
      expect(fuegoBookmarkDelete).toBeCalledWith(1, "OEbKA4NXytlPRH2MkgZ1", {
        releasedYear: 2015,
        releasedDecade: 2010,
        addedDate: "2020-12-24T09:17:07.861Z",
        type: "movie",
        genre: "action",
      });
    });
  });
});
