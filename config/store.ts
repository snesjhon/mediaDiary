import { createContext } from "react";
import { MediaEdit, MediaSelected, MediaTypes } from "./mediaTypes";

export interface MDState {
  page: number;
  selected?: MediaSelected;
  edit?: MediaEdit;
  filterBy: MediaTypes[];
}

type Actions =
  | {
      type: "select";
      payload: MDState["selected"];
    }
  | {
      type: "edit";
      payload: MDState["edit"];
    }
  | {
      type: "filter";
      payload: MDState["filterBy"];
    }
  | {
      type: "state";
      payload: {
        key: keyof MDState;
        value: any;
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
    case "select": {
      return {
        ...state,
        selected: actions.payload,
        edit: undefined,
      };
    }
    case "edit": {
      return {
        ...state,
        edit: actions.payload,
        selected: undefined,
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  page: 1,
  filterBy: ["album", "movie", "tv"],
});

export const ContextDispatch = createContext<(props: Actions) => void>(
  () => null
);
