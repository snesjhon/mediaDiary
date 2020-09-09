export type MediaTypes = "movie" | "album" | "tv";

export interface MediaBaseInfo {
  releasedDate: Date | "";
  type: MediaTypes;
}

export interface MediaInfoAdd extends MediaBaseInfo {
  artist: string;
  title: string;
  poster: string;
  overview?: string;
}

export interface MediaInfoState {
  [key: string]: MediaInfoAdd;
}

export interface MediaDiaryAdd extends MediaBaseInfo {
  diaryDate: firebase.firestore.Timestamp;
  addedDate: firebase.firestore.Timestamp;
  id: string;
  episode?: number | undefined;
  season?: number | undefined;
  seenBefore: boolean;
  star: number;
}

export interface MediaDiaryState {
  [key: string]: MediaDiaryAdd;
}

export interface MediaSelected extends MediaInfoAdd {
  id: MediaDiaryAdd["id"];
}
// title: MediaDateAdd["title"];
// poster: MediaDateAdd["poster"];
// overview?: MediaDateAdd["overview"];

// id: string;
// artist:
// releaseDate:

// type:
// releasedDate: Date | "";
// type: MediaTypes;

// poster: string;
// title: string;
// overview?: string;
// season?: number | undefined;
// episode?: number | undefined;
