import type { MediaTypes, DiaryAddWithId } from "../config/types";
import { fuegoDb } from "./fuego";

export async function fuegoChartYear(
  key: string,
  uid: string,
  diaryYear: number | null,
  mediaType: MediaTypes | null,
  loggedBefore: boolean | null
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as firebase.firestore.Query;

  diaryRef = diaryRef.where("diaryYear", "==", diaryYear);

  if (mediaType !== null) {
    diaryRef = diaryRef.where("type", "==", mediaType);
  }

  if (loggedBefore !== null) {
    diaryRef = diaryRef.where("loggedBefore", "==", loggedBefore);
  }

  const diaryItems = await diaryRef.get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });

  return items;
}

export async function fuegoChartTop6(
  key: string,
  uid: string,
  year: number | null
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as firebase.firestore.Query;

  if (year !== null) {
    diaryRef = diaryRef.where("diaryYear", "==", year);
  }
  diaryRef = diaryRef.orderBy("rating", "desc");

  const diaryItems = await diaryRef.limit(6).get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });
  return items;
}
