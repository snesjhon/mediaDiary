import type { MediaDiary } from "@/types";

export interface LogState {
  diaryDate: MediaDiary["diaryDate"];
  rating: MediaDiary["rating"];
  loggedBefore: MediaDiary["loggedBefore"];
  seenEpisodes?: MediaDiary["seenEpisodes"];
}

export type LogActions = {
  type: "state";
  payload: {
    key: keyof LogState;
    value: any;
  };
};

export function LogReducer(state: LogState, actions: LogActions): LogState {
  switch (actions.type) {
    case "state":
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    default:
      return state;
  }
}
