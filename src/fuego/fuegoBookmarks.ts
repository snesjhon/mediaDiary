import dayjs from "dayjs";
import type { FilterBookmark } from "../types/typesFilters";
import type {
  MediaDiaryWithId,
  MediaDiary,
  MediaType,
} from "../types/typesMedia";
import fuego, { fuegoDb } from "./fuego";

interface BookmarkKeys {
  releasedDecade: MediaDiary["releasedDecade"];
  releasedYear: MediaDiary["releasedYear"];
  type: MediaDiary["type"];
  genre: MediaDiary["genre"];
  addedDate: MediaDiary["addedDate"];
}

export async function fuegoBookmarkGet(
  key: string,
  uid: string,
  cursor: string,
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

  diaryRef = diaryRef.where("bookmark", "==", true);
  diaryRef = diaryRef.orderBy("addedDate", "desc");

  if (cursor !== null) {
    diaryRef = diaryRef.startAfter(cursor);
  }

  const diaryItems = await diaryRef.limit(30).get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });

  return items;
}

/** This assumes this is to add an item as a bookmark ONLY,  */
export async function fuegoBookmarkAdd(
  uid: string,
  data: MediaDiary
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set(
    {
      id: diaryRef.id,
      ...data,
    },
    { merge: true }
  );

  const filtersKeys = bookmarkFilterKeys(data);
  const filtersSetObj = bookmarkFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("bookmarks");
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

/** Given the diaryId we completely remove the item and bookmark */
export async function fuegoBookmarkDelete(
  uid: string,
  diaryId: string,
  data: BookmarkKeys
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.delete(diaryRef);

  const filtersKeys = bookmarkFilterKeys(data);
  const filtersSetObj = bookmarkFilterSet(filtersKeys, -1);
  const filtersRef = fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("bookmarks");
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

/** For items that we HAVE an Id and need to be bookmarked, we need to modify the document, but ALSO add filters  */
export async function fuegoBookmarkAddWithId(
  uid: string,
  diaryId: string,
  data: BookmarkKeys
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);

  diaryRef.set({ bookmark: true }, { merge: true });

  const filtersKeys = bookmarkFilterKeys(data);
  const filtersSetObj = bookmarkFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("bookmarks");
  filtersRef.set(filtersSetObj, { merge: true });

  try {
    return batch.commit();
  } catch {
    console.error("[FUEGO-BOOKMARK]: Failed bookmarkWithId");
  }
}

export async function fuegoBookmarkDeleteWithId(
  uid: string,
  diaryId: string,
  data: BookmarkKeys
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);

  diaryRef.set({ bookmark: false }, { merge: true });

  const filtersKeys = bookmarkFilterKeys(data);
  const filtersSetObj = bookmarkFilterSet(filtersKeys, -1);
  const filtersRef = fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("bookmarks");
  filtersRef.set(filtersSetObj, { merge: true });

  try {
    return batch.commit();
  } catch {
    console.error("[FUEGO-BOOKMARK]: Failed bookmarkDeleteWithId");
  }
}

function bookmarkFilterKeys(data: BookmarkKeys): FilterBookmark {
  return {
    releasedDecade: data.releasedDecade,
    releasedYear: data.releasedYear,
    mediaType: data.type,
    genre: data.genre,
    addedDate: data.addedDate,
  };
}

function bookmarkFilterSet(
  filters: FilterBookmark,
  incrementor: number
): Partial<fuego.firestore.DocumentData> {
  const setObj: Partial<fuego.firestore.DocumentData> = {};
  (Object.keys(filters) as Array<keyof FilterBookmark>).forEach((e) => {
    const addedYear = `${dayjs(filters.addedDate).year()}`;
    if (e === "addedDate" && filters[e] !== null) {
      setObj[e] = {
        [addedYear]: fuego.firestore.FieldValue.increment(incrementor),
      };
    } else {
      setObj[e] = {
        [addedYear]: {
          [`${filters[e]}`]: fuego.firestore.FieldValue.increment(incrementor),
        },
      };
    }
  });
  return setObj;
}
