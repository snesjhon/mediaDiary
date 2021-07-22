import type { MediaDiaryDate, UserPref } from "@/types";
import { fuegoDb, bookmarkFilterKeys, bookmarkFilterSet } from ".";
import {
  createFilterKeys,
  createFilterSet,
} from "../components/Filters/config";

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

  if (data.rating > 0) {
    const memoryRef = fuegoDb
      .collection(`/users/${uid}/filters`)
      .doc("memories");
    const memoryKeys = bookmarkFilterKeys(data);
    const memorySetObj = bookmarkFilterSet(memoryKeys, -1);
    memoryRef.set(memorySetObj, { merge: true });
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
