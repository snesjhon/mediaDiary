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
import { MediaSelected } from "../store/storeMedia";
import { DataByDate } from "../store/storeData";

interface Day extends DataByDate {
  mediaID: string;
}

interface MediaDiaryState {
  view: "media" | "diary";
  viewType?: "search" | "day" | "";
  selected?: MediaSelected;
  day?: Day;
}

const initState: MediaDiaryState = {
  view: "media",
};

export type MediaDiaryActions = {
  type: "view";
  payload: MediaDiaryState;
};

const mediaDiaryReducer = (
  state: MediaDiaryState,
  actions: MediaDiaryActions
) => {
  switch (actions.type) {
    case "view": {
      return {
        ...state,
        view: actions.payload.view,
        selected:
          typeof actions.payload.selected !== "undefined"
            ? actions.payload.selected
            : undefined,
        viewType:
          typeof actions.payload.viewType !== "undefined"
            ? actions.payload.viewType
            : undefined,
        day:
          typeof actions.payload.day !== "undefined"
            ? actions.payload.day
            : undefined,
      };
    }
    default:
      return state;
  }
};

export const MDDispatchCtx = createContext<Dispatch<MediaDiaryActions>>(
  () => {}
);
export const MDStateCtx = createContext<MediaDiaryState>(initState);

function MediaDiary() {
  const [state, dispatch] = useReducer(mediaDiaryReducer, initState);

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
