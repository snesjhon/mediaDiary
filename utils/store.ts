import { createContext } from "react";

interface State {
  user: any;
}

type Actions =
  | {
      type: "addUser";
      payload: any;
    }
  | {
      type: "state";
      payload: {
        key: keyof State;
        value: any;
      };
    };

export const Reducer = (state: State, actions: Actions) => {
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

export const ContextState = createContext<State>({ user: null });
export const ContextDispatch = createContext<(props: Actions) => void>(
  () => {}
);
