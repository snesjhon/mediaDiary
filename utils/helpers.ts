import { DiaryState } from "../config/mediaTypes";

export function fetcher(url: string) {
  const urlString =
    process.env.NODE_ENV === "development" ? `${url}&isLocal=true` : url;
  return fetch(urlString).then((res) => res.json());
}

export function createMediaState(data: { id: string }[]) {
  let diaryState: DiaryState;
  if (Object.keys(data).length > 0) {
    const { id: diaryId, hasPendingWrites, exists, ...diaryItems }: any = data[0];
    diaryState = diaryItems;
  } else {
    diaryState = {};
  }
  return diaryState;
}
