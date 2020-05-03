// https://easy-peasy.now.sh/docs/quick-start.html#create-the-store
import { createStore, createTypedHooks, persist } from "easy-peasy";
import { global, Global } from "./storeGlobal";
import { data, Data } from "./storeData";
import { media, Media } from "./storeMedia";

export interface StoreModel {
  global: Global;
  data: Data;
  media: Media;
}

const storeModel = persist(
  {
    global,
    data,
    media
  },
  { whitelist: ["global", "media"] }
);

const typedHooks = createTypedHooks<StoreModel>();

export const store = createStore(storeModel);
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
