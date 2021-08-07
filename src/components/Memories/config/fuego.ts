import { fuegoDb } from "@/fuego";
import type fuego from "@/fuego/fuego";
import type { MediaDiaryWithId, MediaType, SortType } from "@/types";

export async function fuegoMemoriesGet(
  key: string,
  uid: string,
  cursor: string,
  sortType: SortType = { type: "addedDate", sort: "desc" },
  mediaTypes: MediaType[] | null,
  releasedDecade: number | null,
  addedDate: number | null,
  genre: string | null
): Promise<MediaDiaryWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  if (mediaTypes !== null) {
    diaryRef = diaryRef.where("type", "in", mediaTypes);
  }

  if (releasedDecade !== null) {
    diaryRef = diaryRef.where("releasedDecade", "==", releasedDecade);
  }

  if (addedDate !== null) {
    diaryRef = diaryRef.where("addedDate", "==", addedDate);
  }

  if (genre !== null) {
    diaryRef = diaryRef.where("genre", "==", genre);
  }

  diaryRef = diaryRef
    .where("memory", "==", true)
    .orderBy(sortType.type, sortType.sort);

  if (cursor !== null) {
    const cursorItem = await fuegoDb
      .collection(`users/${uid}/diary`)
      .doc(cursor)
      .get();

    diaryRef = diaryRef.startAfter(cursorItem);
  }

  const diaryItems = await diaryRef.limit(30).get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });

  return items;
}
