import { createContext } from "react";

export interface MDState {
  user: any;
  view: "main" | "search" | "log";
  selected?: any;
}

type Actions =
  | {
      type: "addUser";
      payload: any;
    }
  | {
      type: "select";
      payload: {
        view: MDState["view"];
        selected: any;
      };
    }
  | {
      type: "state";
      payload: {
        key: keyof MDState;
        value: any;
      };
    };

export const Reducer = (state: MDState, actions: Actions) => {
  switch (actions.type) {
    case "state":
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    default:
      return state;
  }
};

export const ContextState = createContext<MDState>({
  user: null,
  view: "main",
});
export const ContextDispatch = createContext<(props: Actions) => void>(
  () => {}
);
