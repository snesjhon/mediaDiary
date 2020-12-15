import type { DiaryAdd } from "./mediaTypes";

export interface LogProps {
  diaryDate: string;
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
  artistId?: DiaryAdd["artistId"];
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
      type: "artistId" | "genre";
      payload: string;
    }
  | {
      type: "season";
      payload: {
        poster: string;
        externalSeason: any;
      };
    };

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
    case "genre": {
      return {
        ...state,
        genre: actions.payload,
        isLoading: false,
      };
    }
    case "artistId": {
      return {
        ...state,
        artistId: actions.payload,
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
