import { createContext } from "react";
import { MediaDiaryAdd, MediaInfoAdd, MediaSelected } from "./mediaTypes";
import { useRouter } from "next/router";

export interface MDState {
  user: any;
  view: "main" | "search" | "log";
  selected?: MediaSelected;
  edit?: {
    item: MediaDiaryAdd;
    info: MediaInfoAdd;
  };
}

type Actions =
  | {
      type: "addUser";
      payload: any;
    }
  | {
      type: "select";
      payload: MDState["selected"];
    }
  | {
      type: "edit";
      payload: MDState["edit"];
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
    case "select": {
      return {
        ...state,
        selected: actions.payload,
      };
    }
    case "edit": {
      return {
        ...state,
        edit: actions.payload,
      };
    }
    default:
      return state;
  }
}

export const ContextState = createContext<MDState>({
  user: null,
  view: "main",
});

export const ContextDispatch = createContext<(props: Actions) => void>(
  () => {}
);
