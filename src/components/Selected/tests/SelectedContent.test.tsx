import dayjs from "dayjs";
import { Button } from "@chakra-ui/react";
import React from "react";
import { fuegoBookmarkAdd } from "../../../fuego/fuegoBookmarks";
import {
  mockMovieFetchData,
  mockMovieSelected,
  mountWithDrawerSuspense,
} from "../../../utils/test-utils";
import MdLoader from "../../md/MdLoader";
import { MediaMovie, MediaSpotify, MediaTV } from "../../Media";
import { SelectedContent } from "../components";

let mockIsLoading = true;
jest.mock("../../../config/useDataFetch", () => {
  return jest.fn(() => ({
    data: mockMovieFetchData,
    isLoading: mockIsLoading,
  }));
});

jest.mock("../../../fuego/useFuegoUser", () => {
  return jest.fn(() => ({
    user: {
      uid: 1,
    },
  }));
});

jest.mock("../../../fuego/fuegoBookmarks", () => ({
  fuegoBookmarkAdd: jest.fn(),
}));

jest.spyOn(dayjs(), "toISOString").mockImplementation(() => "1234");
describe("<SelectedContent /> ", () => {
  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2020, 3, 3));
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
      const btn = wrapper.find(Button, { id: "selectedBookmark" });
      btn?.trigger("onClick");
      expect(fuegoBookmarkAdd).toBeCalledWith(1, {
        releasedYear: 2015,
        releasedDecade: 2010,
        addedDate: "2020-04-03T07:00:00.000Z",
        type: "movie",
        genre: "Adventure",
        mediaId: "76341",
        poster: "8tZYtuWezp8JbcsvHYO0O46tFbo",
        artist: "Steven Spielberg",
        title: "Mad Max: Fury Road",
        releasedDate: "2015-05-13T07:00:00.000Z",
        bookmark: true,
        rating: -1,
        diaryDate: null,
        diaryYear: null,
        loggedBefore: false,
      });
    });
  });
});
