import { fuegoDb } from "../../../fuego/fuego";
import {
  bookmarkFilterKeys,
  bookmarkFilterSet,
} from "../../../fuego/fuegoBookmarks";
import type { BookmarkKeys } from "../../../fuego/fuegoBookmarks";
import type { MediaDiaryWithId } from "@/types";

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

export async function fuegoDiaryEntry(
  key: string,
  uid: string,
  diaryId: string
): Promise<MediaDiaryWithId | false> {
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  const diaryItem = await diaryRef.get();
  return (diaryItem.data() as MediaDiaryWithId) ?? false;
}
