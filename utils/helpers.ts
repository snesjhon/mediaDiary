import { MediaDiaryState, MediaInfoState } from "../config/mediaTypes";

export function fetcher(url: string, token: string) {
  return fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());
}

export function createMediaState(
  data: {
    id: string;
  }[]
) {
  // swr-firebase adds these (useful but unnecessary) keys, so remove them and assign a key
  const { id: diaryId, hasPendingWrites, exists, ...diaryItems }: any = data[0];
  const {
    id: mediaId,
    hasPendingWrites: mediaWrites,
    exists: mediaExists,
    ...mediaItems
  }: any = data[1];
  const diaryState: MediaDiaryState = diaryItems;
  const mediaState: MediaInfoState = mediaItems;
  return {
    diaryState,
    mediaState,
  };
}
