import { DiaryAdd } from "./mediaTypes";

export interface LogProps {
  diaryDate: Date;
  rating: DiaryAdd["rating"];
  loggedBefore: DiaryAdd["loggedBefore"];
  poster: DiaryAdd["poster"];
  seenEpisodes?: DiaryAdd["seenEpisodes"];
  episodes?: DiaryAdd["episodes"];
  season?: DiaryAdd["season"];
  externalSeasons?: any[];
  externalSeason?: any;
}

export interface LogState extends LogProps {
  isSaving?: boolean;
  isLoading?: boolean;
  artist: DiaryAdd["artist"];
  genre: DiaryAdd["genre"];
  overview?: DiaryAdd["overview"];
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
        externalSeason: any;
        externalSeasons: any;
      };
    }
  | {
      type: "editSeasons";
      payload: {
        externalSeasons: any;
        externalSeason: any;
      };
    }
  | {
      type: "credits";
      payload: {
        artist: string;
        genre: string;
      };
    }
  | {
      type: "overview";
      payload: string;
    }
  | {
      type: "season";
      payload: {
        poster: string;
        externalSeason: any;
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
        externalSeason: actions.payload.externalSeason,
        externalSeasons: actions.payload.externalSeasons,
        ...(typeof actions.payload.poster !== "undefined" && {
          poster: actions.payload.poster,
        }),
        seenEpisodes: [],
        isLoading: false,
      };
    }
    case "editSeasons": {
      return {
        ...state,
        externalSeasons: actions.payload.externalSeasons,
        externalSeason: actions.payload.externalSeason,
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
    case "overview": {
      return {
        ...state,
        overview: actions.payload,
        isLoading: false,
      };
    }
    case "season": {
      return {
        ...state,
        externalSeason: actions.payload.externalSeason,
        seenEpisodes: [],
        poster: actions.payload.poster,
      };
    }
    default:
      return state;
  }
}
