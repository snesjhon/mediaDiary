import type {
  UserFuegoPref,
  MediaSelected,
  MDbTV,
  MDbMovie,
  SpotifyArtist,
  SpotifyAlbum,
  MediaDiaryWithId,
} from "@/types";
import { createContext, useContext } from "react";
import type {
  FilterState,
  FilterBookmarkState,
} from "../components/Filters/config";

export interface MDState {
  preference: UserFuegoPref;
  isSaving?: boolean;
  isLoggedBefore?: boolean;
  view?:
    | "search"
    | "log"
    | "logRating"
    | "edit"
    | "editRating"
    | "md"
    | "activity"
    | "day"
    | "dayRating"
    | "selected";
  selected?: MediaSelected;
  selectedTV?: MDbTV;
  selectedMovie?: MDbMovie;
  selectedSpotify?: {
    artist: SpotifyArtist;
    album: SpotifyAlbum;
  };
  edit?: MediaDiaryWithId;
  editMovie?: MDbMovie;
  editTV?: MDbTV;
  editSpotify?: {
    artist: SpotifyArtist;
    album: SpotifyAlbum;
  };
  diaryFilters: FilterState | null;
  bookmarkFilters: FilterBookmarkState | null;
}

export type MDActions =
  | {
      type: "selected" | "selectedReplace";
      payload: MDState["selected"];
    }
  | {
      type: "log" | "logAgain" | "logRating";
      payload: {
        selected: MDState["selected"];
        selectedTV: MDState["selectedTV"];
        selectedMovie: MDState["selectedMovie"];
        selectedSpotify: MDState["selectedSpotify"];
      };
    }
  | {
      type: "edit" | "editRating";
      payload: {
        edit: MDState["edit"];
        editMovie: MDState["editMovie"];
        editTV: MDState["editTV"];
        editSpotify: MDState["editSpotify"];
      };
    }
  | {
      type: "view";
      payload: MDState["view"];
    }
  | {
      type: "day" | "dayRating" | "savedEdit";
      payload: MDState["edit"];
    }
  | {
      type: "savedPreference";
      payload: MDState["preference"];
    }
  | {
      type: "close" | "saved" | "saving";
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
    case "saved": {
      return {
        ...state,
        isSaving: false,
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
    case "close": {
      return {
        ...state,
        isSaving: false,
        view: "md",
        edit: undefined,
        isLoggedBefore: false,
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
    case "logRating": {
      return {
        ...state,
        selected: actions.payload.selected,
        selectedMovie: actions.payload.selectedMovie,
        selectedTV: actions.payload.selectedTV,
        selectedSpotify: actions.payload.selectedSpotify,
        view: "logRating",
        edit: undefined,
      };
    }
    case "logAgain": {
      return {
        ...state,
        selected: actions.payload.selected,
        selectedMovie: actions.payload.selectedMovie,
        selectedTV: actions.payload.selectedTV,
        selectedSpotify: actions.payload.selectedSpotify,
        view: "log",
        edit: undefined,
        isLoggedBefore: true,
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
    case "day": {
      return {
        ...state,
        view: "day",
        selected: undefined,
        edit: actions.payload,
      };
    }
    case "dayRating": {
      return {
        ...state,
        view: "dayRating",
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
        edit: actions.payload.edit,
        editMovie: actions.payload.editMovie,
        editTV: actions.payload.editTV,
        editSpotify: actions.payload.editSpotify,
      };
    }
    case "editRating": {
      return {
        ...state,
        view: "editRating",
        selected: undefined,
        edit: actions.payload.edit,
        editMovie: actions.payload.editMovie,
        editTV: actions.payload.editTV,
        editSpotify: actions.payload.editSpotify,
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
