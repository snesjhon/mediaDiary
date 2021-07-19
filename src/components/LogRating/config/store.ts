import type { MediaDiary } from "@/types";

export interface LogRatingState {
  rating: MediaDiary["rating"];
  seenEpisodes?: MediaDiary["seenEpisodes"];
}

export type LogRatingActions = {
  type: "state";
  payload: {
    key: keyof LogRatingState;
    value: any;
  };
};

export function LogRatingReducer(
  state: LogRatingState,
  actions: LogRatingActions
): LogRatingState {
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
