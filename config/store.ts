import { createContext } from "react";
import { MediaSelected } from "./mediaTypes";
import { useRouter } from "next/router";

export interface MDState {
  user: any;
  view: "main" | "search" | "log";
  selected?: MediaSelected;
}

type Actions =
  | {
      type: "addUser";
      payload: any;
    }
  | {
      type: "select";
      payload: MediaSelected;
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
