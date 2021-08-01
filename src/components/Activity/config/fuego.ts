import { fuegoDb } from "@/fuego";
import type fuego from "@/fuego/fuego";
import type { MediaType, MediaDiaryWithId } from "@/types";

export async function fuegoChartYear(
  key: string,
  uid: string,
  diaryYear: number | false,
  mediaType: MediaType | null
): Promise<MediaDiaryWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  if (diaryYear !== null) {
    diaryRef = diaryRef.where("diaryYear", "==", diaryYear);
  }

  if (mediaType !== null) {
    diaryRef = diaryRef.where("type", "==", mediaType);
  }

  diaryRef = diaryRef.orderBy("rating", "desc").orderBy("addedDate", "desc");

  const diaryItems = await diaryRef.get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });

  return items;
}

export async function fuegoChartTop6(
  key: string,
  uid: string,
  count = 6
): Promise<MediaDiaryWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  diaryRef = diaryRef.orderBy("rating", "desc").orderBy("addedDate", "desc");

  const diaryItems = await diaryRef.limit(count).get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });
  return items;
}
