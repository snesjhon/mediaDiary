import type {
  MediaDiaryDate,
  MediaDiaryWithId,
  MediaType,
} from "../types/typesMedia";
import type { UserPref } from "../types/typesUser";
import type fuego from "./fuego";
import { fuegoDb } from "./fuego";
import { bookmarkFilterKeys, bookmarkFilterSet } from "./fuegoBookmarks";
import {
  createFilterEditSet,
  createFilterKeys,
  createFilterSet,
} from "./fuegoFilterActions";

export async function fuegoDiaryFieldEdit(
  uid: string,
  mediaId: string,
  field: string,
  data: string | boolean | number
): Promise<void> {
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(mediaId);
  try {
    await diaryRef.set({ [field]: data }, { merge: true });
  } catch (e) {
    throw `[fuegoSetPreferences]: Failed to set, ${e}`;
  }
}

export async function fuegoDelete(
  uid: string,
  diaryId: string,
  data: MediaDiaryDate
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.delete(diaryRef);

  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, -1);
  filtersRef.set(filtersSetObj, { merge: true });

  if (data.bookmark) {
    const bookmarkKeys = bookmarkFilterKeys(data);
    const bookmarkObj = bookmarkFilterSet(bookmarkKeys, -1);
    const bookmarkRef = fuegoDb
      .collection(`/users/${uid}/filters`)
      .doc("bookmarks");
    bookmarkRef.set(bookmarkObj, { merge: true });
  }

  return batch.commit();
}

export async function fuegoDiaryEntry(
  key: string,
  uid: string,
  diaryId: string
): Promise<MediaDiaryWithId | false> {
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  const diaryItem = await diaryRef.get();
  return (diaryItem.data() as MediaDiaryWithId) ?? false;
}

export async function fuegoDiaryById(
  key: string,
  uid: string,
  type: MediaType,
  mediaId: string,
  season: number
): Promise<MediaDiaryWithId | false> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;
  diaryRef = diaryRef.where("mediaId", "==", mediaId);
  if (type === "tv") {
    diaryRef = diaryRef.where("season", "==", season);
  }

  const diaryItems = await diaryRef.limit(1).get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });

  return items.length > 0 ? items[0] : false;
}

export async function fuegoEdit(
  uid: string,
  diaryId: string,
  data: MediaDiaryDate,
  prevData: MediaDiaryDate
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.update(diaryRef, { ...data, bookmark: false });

  // We have the following cases
  // Bookmark -> New Diary
  // Old Diary -> New Diary
  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  let setObj: Partial<fuego.firestore.DocumentData>;

  // TODO: This works for now, because we don't have the MEMORIES, feature. But
  // We'll have to come back to this because when we add it, we'll have a weird
  // state where this WILL be null for PREV and CURRENT
  if (prevData.diaryYear === null && data.diaryYear !== null) {
    const filtersKeys = createFilterKeys(data);
    setObj = createFilterSet(filtersKeys, 1);
  } else {
    setObj = createFilterEditSet(data, prevData, [
      "rating",
      "releasedDecade",
      "loggedBefore",
      "diaryYear",
      "releasedYear",
    ]);
  }
  if (setObj) {
    filtersRef.set(setObj, { merge: true });
  }

  if (data.bookmark) {
    const bookmarkKeys = bookmarkFilterKeys(data);
    const bookmarkObj = bookmarkFilterSet(bookmarkKeys, -1);
    const bookmarkRef = fuegoDb
      .collection(`/users/${uid}/filters`)
      .doc("bookmarks");
    bookmarkRef.set(bookmarkObj, { merge: true });
  }

  return batch.commit();
}

export async function fuegoSetPreferences(
  uid: string,
  preference: UserPref
): Promise<void> {
  const userRef = fuegoDb.collection("users").doc(uid);
  try {
    await userRef.set({ preference }, { merge: true });
  } catch (e) {
    throw `[fuegoSetPreferences]: Failed to set, ${e}`;
  }
}
