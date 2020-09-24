import { DiaryState, MediaState } from "../config/mediaTypes";

export function fetcher(url: string) {
  const urlString =
    process.env.NODE_ENV === "development" ? `${url}&isLocal=true` : url;
  return fetch(urlString).then((res) => res.json());
}

export function createMediaState(
  data: {
    id: string;
  }[]
) {
  let diaryState: DiaryState;
  let mediaState: MediaState;
  if (data.length > 0) {
    const {
      id: diaryId,
      hasPendingWrites,
      exists,
      ...diaryItems
    }: any = data[0];
    const {
      id: mediaId,
      hasPendingWrites: mediaWrites,
      exists: mediaExists,
      ...mediaItems
    }: any = data[1];
    diaryState = diaryItems;
    mediaState = mediaItems;
  } else {
    diaryState = {};
    mediaState = {};
  }
  return {
    diaryState,
    mediaState,
  };
}
