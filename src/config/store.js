import React, { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  theme: "light",
  list: [],
  diary: []
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ADD_MEDIA":
      return {
        ...state,
        list: [...state.list, ...payload]
      };
    default:
      return state;
  }
};

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
