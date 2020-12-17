import type dayjs from "dayjs";
import { createContext, useContext } from "react";
import type { MediaEdit, MediaSelected, MediaTypes } from "./mediaTypes";

export interface MDState {
  page: number;
  spotifyToken?: string;
  spotifyTimeOut?: dayjs.Dayjs;
  isSaving?: boolean;
  view?: "search" | "log" | "edit" | "day" | "md" | "activity";
  selected?: MediaSelected;
  edit?: MediaEdit;
  filterBy: MediaTypes[];
}

type Actions =
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
      type: "saved" | "saving" | "dayClose";
    }
  | {
      type: "filter";
      payload: MDState["filterBy"];
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

export function Reducer(state: MDState, actions: Actions): MDState {
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
        filterBy: actions.payload,
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
  page: 1,
  filterBy: ["movie", "tv", "album"],
});

export const ContextDispatch = createContext<(props: Actions) => void>(
  () => null
);

export function useMDState(): MDState {
  return useContext(ContextState);
}
export function useMDDispatch(): (props: Actions) => void {
  return useContext(ContextDispatch);
}
