import { createContext } from "react";
import { MediaDiaryAdd, MediaInfoAdd, MediaSelected } from "./mediaTypes";

export interface MDState {
  user: any;
  selected?: MediaSelected;
  edit?: {
    itemId: string;
    item: MediaDiaryAdd;
    info: MediaSelected;
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
  user: null,
});

export const ContextDispatch = createContext<(props: Actions) => void>(
  () => {}
);
