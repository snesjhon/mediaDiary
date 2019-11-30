import { Action, action, Thunk, thunk } from "easy-peasy";
import { MDB_URL, MBD_KEY, FM_KEY } from "./constants";
import { StoreModel } from "./store";

export interface MediaInfo {
  id: string;
  poster: string;
  title: string;
  published: Date | "";
  overview: string;
  artist: string;
  season?: number | undefined;
}

export interface MediaAdd extends MediaInfo, MediaTypes {
  date: Date | "";
  seen: boolean;
  star: number;
}

export interface MediaSelected extends MediaInfo {
  watched: string | undefined;
}

export interface MediaTypes {
  type: "film" | "tv" | "album" | "";
}

export interface Media {
  mediaSelected: MediaSelected;
  mediaSelect: Action<Media, MediaSelected | void>;
  mediaPutFilm: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutTV: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutAlbum: Thunk<Media, MediaAdd, void, StoreModel>;
}

const mediaInit = {
  id: "",
  poster: "",
  title: "",
  published: new Date(),
  overview: "",
  artist: "",
  watched: undefined,
  season: undefined
};

export const media: Media = {
  mediaSelected: mediaInit,
  mediaSelect: action((state, payload) => {
    state.mediaSelected = payload ? payload : mediaInit;
  }),
  mediaPutFilm: thunk(async (actions, payload, { getStoreActions }) => {
    const mbdResult = await fetch(
      `${MDB_URL}/movie/${payload.id}/credits?api_key=${MBD_KEY}`
    );
    const credits = await mbdResult.json();
    const filmMedia = {
      ...payload,
      artist: credits.crew.find((e: any) => e.job === "Director").name
    };
    actions.mediaSelect();
    getStoreActions().data.dataPut(filmMedia);
  }),
  mediaPutTV: thunk(async (actions, payload, { getStoreActions }) => {
    actions.mediaSelect();
    getStoreActions().data.dataPut(payload);
  }),
  mediaPutAlbum: thunk(async (actions, payload, { getStoreActions }) => {
    const fmResult = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${payload.artist}&album=${payload.title}&format=json&api_key=${FM_KEY}`
    );
    const info = await fmResult.json();
    const albumObj = {
      ...payload,
      overview:
        typeof info.album.wiki !== "undefined"
          ? info.album.wiki.summary.split("<a href")[0]
          : ""
    };
    actions.mediaSelect();
    getStoreActions().data.dataPut(albumObj);
  })
};
