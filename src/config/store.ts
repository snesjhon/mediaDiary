import { createContext, useContext } from "react";
import type { FilterBookmarkState, FilterState } from "../types/typesFilters";
import type { MDbMovie, MDbTV } from "../types/typesMDb";
import type { MediaDiaryWithId, MediaSelected } from "../types/typesMedia";
import type { SpotifyAlbum, SpotifyArtist } from "../types/typesSpotify";
import type { UserFuegoPref } from "../types/typesUser";

export interface MDState {
  preference: UserFuegoPref;
  isSaving?: boolean;
  view?:
    | "search"
    | "log"
    | "edit"
    | "md"
    | "activity"
    | "selected"
    | "selectedWithId";
  selected?: MediaSelected;
  selectedTV?: MDbTV;
  selectedMovie?: MDbMovie;
  selectedSpotify?: {
    artist: SpotifyArtist;
    album: SpotifyAlbum;
  };
  edit?: MediaDiaryWithId;
  diaryFilters: FilterState | null;
  bookmarkFilters: FilterBookmarkState | null;
}

export type MDActions =
  | {
      type: "selected" | "selectedReplace";
      payload: MDState["selected"];
    }
  | {
      type: "log";
      payload: {
        selected: MDState["selected"];
        selectedTV: MDState["selectedTV"];
        selectedMovie: MDState["selectedMovie"];
        selectedSpotify: MDState["selectedSpotify"];
      };
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
      type: "selectedWithId" | "savedEdit";
      payload: MDState["edit"];
    }
  | {
      type: "savedPreference";
      payload: MDState["preference"];
    }
  | {
      type: "saved" | "savedd" | "saving" | "dayClose";
    }
  | {
      type: "filter";
      payload: FilterState;
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
        diaryFilters: actions.payload,
      };
    }
    case "saving": {
      return {
        ...state,
        isSaving: true,
      };
    }
    case "savedd": {
      return {
        ...state,
        isSaving: false,
      };
    }
    case "savedEdit": {
      return {
        ...state,
        isSaving: false,
        view: "selectedWithId",
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
        selected: actions.payload.selected,
        selectedMovie: actions.payload.selectedMovie,
        selectedTV: actions.payload.selectedTV,
        selectedSpotify: actions.payload.selectedSpotify,
        view: "log",
        edit: undefined,
      };
    }
    case "selected": {
      return {
        ...state,
        view: "selected",
        selected: actions.payload,
        edit: undefined,
        isSaving: false,
      };
    }
    case "selectedWithId": {
      return {
        ...state,
        view: "selectedWithId",
        selected: undefined,
        edit: actions.payload,
      };
    }
    case "selectedReplace": {
      return {
        ...state,
        selected: actions.payload,
      };
    }
    case "edit": {
      return {
        ...state,
        view: "edit",
        selected: undefined,
        edit: actions.payload,
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  preference: null,
  diaryFilters: null,
  bookmarkFilters: null,
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
