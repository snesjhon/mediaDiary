import { Action, action, Thunk, thunk } from "easy-peasy";
import { LASTFMKEY } from "./constants";
import { StoreModel } from "./store";

export type MediaTyper = "film" | "tv" | "album" | "";

export interface MediaInfo {
  id: string;
  poster: string;
  title: string;
  published: Date | "";
  artist: string;
  overview?: string;
  backdrop?: string;
  season?: number | undefined;
  episode?: number | undefined;
}

export interface MediaAdd extends MediaInfo {
  date: Date;
  seen: boolean;
  star: number;
  type: MediaTyper;
}

export interface MediaSelected extends MediaInfo {
  watched: string | undefined;
  type: MediaTyper;
}

export interface MediaTypes {
  type: MediaTyper;
}

export interface Media {
  mediaSelected: MediaSelected;
  mediaSelect: Action<
    Media,
    { mediaSelected: MediaSelected | void; cb: () => void }
  >;
  mediaPutFilm: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutTV: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutAlbum: Thunk<Media, MediaAdd, void, StoreModel>;
}

const mediaInit: MediaSelected = {
  id: "",
  poster: "",
  title: "",
  published: new Date(),
  overview: "",
  artist: "",
  watched: undefined,
  type: "",
  season: undefined,
};

export const media: Media = {
  mediaSelected: mediaInit,
  mediaSelect: action((state, payload) => {
    state.mediaSelected = payload.mediaSelected
      ? payload.mediaSelected
      : mediaInit;
    return payload.cb();
  }),
  mediaPutFilm: thunk(async (actions, payload, { getStoreActions }) => {
    return getStoreActions()
      .data.dataPut(payload)
      .then(() => {
        return getStoreActions().data.dataGet();
      });
  }),
  mediaPutTV: thunk(async (actions, payload, { getStoreActions }) => {
    getStoreActions().data.dataPut(payload);
  }),
  mediaPutAlbum: thunk(async (actions, payload, { getStoreActions }) => {
    const fmResult = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(
        payload.artist
      )}&album=${encodeURIComponent(
        payload.title
      )}&format=json&api_key=${LASTFMKEY}`
    );
    const info = await fmResult.json();
    const albumObj = {
      ...payload,
      overview:
        typeof info.album.wiki !== "undefined"
          ? info.album.wiki.summary.split("<a href")[0]
          : "",
    };
    getStoreActions().data.dataPut(albumObj);
  }),
};
