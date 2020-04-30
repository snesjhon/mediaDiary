/**
 * MediaDiary
 * ---
 * This handles all the state for our app to display
 * appropriate views depending on where we are
 */

import * as React from "react";
import { useReducer, createContext, Dispatch } from "react";
import Media from "./Media";
import Diary from "./Diary";

interface MediaDiaryState {
  view: "media" | "diary";
}

export interface MediaDiaryActions {
  type: "view";
  payload: {
    view: MediaDiaryState["view"];
    metadata?: any;
  };
}

const mediaDiaryReducer = (
  state: MediaDiaryState,
  actions: MediaDiaryActions
) => {
  switch (actions.type) {
    case "view": {
      return {
        ...state,
        view: actions.payload.view,
        metadata: actions.payload.metadata,
      };
    }
    default:
      return state;
  }
};

export const MDDispatchCtx = createContext<Dispatch<MediaDiaryActions>>(
  () => {}
);
export const MDStateCtx = createContext({});

function MediaDiary() {
  const [state, dispatch] = useReducer(mediaDiaryReducer, {
    view: "media",
    metadata: {},
  });

  return (
    <MDDispatchCtx.Provider value={dispatch}>
      <MDStateCtx.Provider value={state}>
        {state.view === "media" && <Media />}
        {state.view === "diary" && <Diary />}
      </MDStateCtx.Provider>
    </MDDispatchCtx.Provider>
  );
}

export default MediaDiary;
