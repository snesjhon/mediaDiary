import dayjs from "dayjs";
import type { FilterBookmark } from "../components/Filters/config";
import type { MediaDiary } from "../types/typesMedia";
import fuego, { fuegoDb } from "./fuego";

export interface BookmarkKeys {
  releasedDecade: MediaDiary["releasedDecade"];
  releasedYear: MediaDiary["releasedYear"];
  type: MediaDiary["type"];
  genre: MediaDiary["genre"];
  addedDate: MediaDiary["addedDate"];
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

export function bookmarkFilterKeys(data: BookmarkKeys): FilterBookmark {
  return {
    releasedDecade: data.releasedDecade,
    releasedYear: data.releasedYear,
    mediaType: data.type,
    genre: data.genre,
    addedDate: data.addedDate,
  };
}

export function bookmarkFilterSet(
  filters: FilterBookmark,
  incrementor: number
): Partial<fuego.firestore.DocumentData> {
  const setObj: Partial<fuego.firestore.DocumentData> = {};
  (Object.keys(filters) as Array<keyof FilterBookmark>).forEach((e) => {
    const addedYear = `${dayjs(filters.addedDate).year()}`;
    if (e === "addedDate" && filters[e]) {
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
