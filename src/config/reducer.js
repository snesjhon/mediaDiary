import { ADD_MEDIA } from "./actions";

export const initialState = {
  theme: "light",
  list: [],
  diary: []
};

export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_MEDIA:
      return {
        ...state,
        list: [...state.list, ...payload]
      };
    default:
      return state;
  }
};
