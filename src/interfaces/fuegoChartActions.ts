import type { MediaType, DiaryAddWithId } from "../config/types";
import { fuegoDb } from "./fuego";
import type fuego from "./fuego";

export async function fuegoChartYear(
  key: string,
  uid: string,
  diaryYear: number | null,
  mediaType: MediaType | null
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  if (diaryYear !== null) {
    diaryRef = diaryRef.where("diaryYear", "==", diaryYear);
  }

  if (mediaType !== null) {
    diaryRef = diaryRef.where("type", "==", mediaType);
  }

  diaryRef = diaryRef.orderBy("rating", "desc");

  const diaryItems = await diaryRef.get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });

  return items;
}

export async function fuegoChartTop6(
  key: string,
  uid: string
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  diaryRef = diaryRef.orderBy("rating", "desc");

  const diaryItems = await diaryRef.limit(6).get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });
  return items;
}
