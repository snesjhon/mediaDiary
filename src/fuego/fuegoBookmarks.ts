import type { FilterBookmark } from "../types/typesFilters";
import type {
  MediaBookmark,
  MediaBookmarkWithId,
  MediaType,
} from "../types/typesMedia";
import fuego, { fuegoDb } from "./fuego";

export async function fuegoBookmarkGet(
  key: string,
  uid: string,
  cursor: string,
  mediaTypes: MediaType[] | null,
  releasedDecade: number | null,
  addedDate: number | null,
  genre: string | null
): Promise<MediaBookmarkWithId[]> {
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

  diaryRef = diaryRef.orderBy("addedDate", "desc");

  if (cursor !== null) {
    diaryRef = diaryRef.startAfter(cursor);
  }

  const diaryItems = await diaryRef.limit(30).get();

  const items: MediaBookmarkWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaBookmarkWithId);
  });

  return items;
}

export async function fuegoBookmarkAdd(
  uid: string,
  data: MediaBookmark
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/bookmarks`).doc();
  diaryRef.set({ id: diaryRef.id, ...data }, { merge: true });

  const filtersKeys = bookmarkFilterKeys(data);
  const filtersSetObj = bookmarkFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("bookmarks");
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

function bookmarkFilterSet(
  filters: FilterBookmark,
  incrementor: number
): Partial<fuego.firestore.DocumentData> {
  const setObj: Partial<fuego.firestore.DocumentData> = {};
  (Object.keys(filters) as Array<keyof FilterBookmark>).forEach((e) => {
    setObj[e] = {
      [`${filters.addedDate}`]: {
        [`${filters[e]}`]: fuego.firestore.FieldValue.increment(incrementor),
      },
    };
  });
  return setObj;
}

function bookmarkFilterKeys(data: MediaBookmark): FilterBookmark {
  return {
    releasedDecade: data.releasedDecade,
    releasedYear: data.releasedYear,
    mediaType: data.type,
    genre: data.genre,
    addedDate: data.addedDate,
  };
}
