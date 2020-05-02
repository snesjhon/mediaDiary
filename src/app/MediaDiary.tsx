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

const initSelected: MediaSelected = {
  id: "",
  poster: "",
  title: "",
  published: "",
  overview: "",
  watched: "",
  artist: "",
  type: "film",
  backdrop: "",
};
interface MediaDiaryState {
  view: "media" | "diary";
  selected?: MediaSelected;
}

const initState: MediaDiaryState = {
  view: "media",
  selected: initSelected,
};

export type MediaDiaryActions =
  | {
      type: "view";
      payload: {
        view: MediaDiaryState["view"];
      };
    }
  | {
      type: "select";
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
      };
    }
    case "select": {
      return {
        ...state,
        view: actions.payload.view,
        selected: actions.payload.selected,
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
