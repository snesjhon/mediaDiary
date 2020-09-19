import { MediaDiaryAdd, MediaInfoAdd } from "./mediaTypes";

export interface LogFields {
  diaryDate: Date;
  seasons?: any[];
  rating: MediaDiaryAdd["rating"];
  loggedBefore: MediaDiaryAdd["loggedBefore"];
  poster: MediaInfoAdd["poster"];
  episodes?: MediaDiaryAdd["episodes"];
  season?: MediaInfoAdd["season"];
}

export interface LogState extends LogFields {
  isSaving: boolean;
  isLoading: boolean;
  artist: MediaInfoAdd["artist"];
  genre: MediaInfoAdd["genre"];
}

export type LogActions =
  | {
      type: "state";
      payload: {
        key: keyof LogState;
        value: any;
      };
    }
  | {
      type: "seasons";
      payload: {
        artist: string;
        poster: string;
        genre: string;
        season: any;
        seasons: any;
      };
    }
  | {
      type: "editSeasons";
      payload: any;
    }
  | {
      type: "credits";
      payload: {
        artist: string;
        genre: string;
      };
    }
  | {
      type: "season";
      payload: {
        poster: string;
        season: any;
      };
    };

export function LogInit(initInfo: any, isLoading: any) {
  let initData = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    isSaving: false,
    isLoading,
    artist: "",
    poster: "",
    genre: "",
  };
  if (typeof initInfo !== "undefined") {
    initData = {
      ...initData,
      artist: initInfo.artist,
      poster: initInfo.poster,
      genre: initInfo.genre,
    };
  }
  return initData;
}

export function LogReducer(state: LogState, actions: LogActions): LogState {
  switch (actions.type) {
    case "state":
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    case "seasons": {
      return {
        ...state,
        artist: actions.payload.artist,
        genre: actions.payload.genre,
        season: actions.payload.season,
        seasons: actions.payload.seasons,
        ...(typeof actions.payload.poster !== "undefined" && {
          poster: actions.payload.poster,
        }),
        episodes: [],
        isLoading: false,
      };
    }
    case "editSeasons": {
      return {
        ...state,
        seasons: actions.payload,
        isLoading: false,
      };
    }
    case "credits": {
      return {
        ...state,
        artist: actions.payload.artist,
        genre: actions.payload.genre,
        isLoading: false,
      };
    }
    case "season": {
      return {
        ...state,
        season: actions.payload.season,
        episodes: [],
        poster: actions.payload.poster,
      };
    }
    default:
      return state;
  }
}
