import type dayjs from "dayjs";
import { createContext, useContext } from "react";
import type {
  FilterState,
  FuegoUserPref,
  MediaEdit,
  MediaSelected,
} from "./types";

export interface MDState extends FilterState {
  preference: FuegoUserPref;
  spotifyToken?: string;
  spotifyTimeOut?: dayjs.Dayjs;
  isSaving?: boolean;
  view?: "search" | "log" | "edit" | "day" | "md" | "activity";
  selected?: MediaSelected;
  edit?: MediaEdit;
}

type MDActions =
  | {
      type: "log";
      payload: MDState["selected"];
    }
  | {
      type: "edit";
      payload: MDState["edit"];
    }
  | {
      type: "view";
      payload: MDState["view"];
    }
  | {
      type: "day" | "savedEdit";
      payload: MDState["edit"];
    }
  | {
      type: "savedPreference";
      payload: MDState["preference"];
    }
  | {
      type: "saved" | "saving" | "dayClose";
    }
  | {
      type: "filter";
      payload: {
        filterMediaType: MDState["filterMediaType"];
        filterRating: MDState["filterRating"];
        filterReleasedDecade: MDState["filterReleasedDecade"];
        filterDiaryYear: MDState["filterDiaryYear"];
        filterLoggedBefore: MDState["filterLoggedBefore"];
        filterGenre: MDState["filterGenre"];
      };
    }
  | {
      type: "spotifyToken";
      payload: {
        spotifyToken: MDState["spotifyToken"];
        spotifyTimeOut: MDState["spotifyTimeOut"];
      };
    }
  | {
      type: "state";
      payload: {
        key: keyof MDState;
        value: unknown;
      };
    };

export function Reducer(state: MDState, actions: MDActions): MDState {
  switch (actions.type) {
    case "state": {
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    }
    case "filter": {
      return {
        ...state,
        view: "md",
        filterMediaType: actions.payload.filterMediaType,
        filterRating: actions.payload.filterRating,
        filterDiaryYear: actions.payload.filterDiaryYear,
        filterReleasedDecade: actions.payload.filterReleasedDecade,
        filterLoggedBefore: actions.payload.filterLoggedBefore,
        filterGenre: actions.payload.filterGenre,
      };
    }
    case "saving": {
      return {
        ...state,
        isSaving: true,
      };
    }
    case "savedEdit": {
      return {
        ...state,
        isSaving: false,
        view: "day",
        edit: actions.payload,
      };
    }
    case "savedPreference": {
      return {
        ...state,
        isSaving: false,
        preference: actions.payload,
      };
    }
    case "dayClose":
    case "saved": {
      return {
        ...state,
        isSaving: false,
        view: "md",
        edit: undefined,
      };
    }
    case "view": {
      return {
        ...state,
        view: actions.payload,
      };
    }
    case "log": {
      return {
        ...state,
        selected: actions.payload,
        view: "log",
        edit: undefined,
      };
    }
    case "day": {
      return {
        ...state,
        view: "day",
        selected: undefined,
        edit: actions.payload,
      };
    }
    case "spotifyToken": {
      return {
        ...state,
        spotifyToken: actions.payload.spotifyToken,
        spotifyTimeOut: actions.payload.spotifyTimeOut,
      };
    }
    case "edit": {
      return {
        ...state,
        view: "edit",
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  preference: null,
  filterGenre: null,
  filterLoggedBefore: null,
  filterMediaType: null,
  filterRating: null,
  filterDiaryYear: null,
  filterReleasedDecade: null,
});

export const ContextDispatch = createContext<(props: MDActions) => void>(
  () => null
);

export function useMDState(): MDState {
  return useContext(ContextState);
}
export function useMDDispatch(): (props: MDActions) => void {
  return useContext(ContextDispatch);
}
