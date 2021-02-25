import { fuegoDb } from "./fuego";
import type fuego from "./fuego";
import {
  createFilterKeys,
  createFilterSet,
  createFilterEditSet,
} from "./fuegoFilterActions";
import type {
  MediaDiary,
  MediaDiaryWithId,
  MediaType,
} from "../types/typesMedia";
import type { UserPref } from "../types/typesUser";

export async function fuegoDiaryGet(
  key: string,
  uid: string,
  cursor: string,
  mediaTypes: MediaType[] | null,
  rating: number | null,
  releasedDecade: number | null,
  diaryYear: number | null,
  loggedBefore: boolean | null,
  genre: string | null
): Promise<MediaDiaryWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;

  if (mediaTypes !== null) {
    diaryRef = diaryRef.where("type", "in", mediaTypes);
  }

  if (rating !== null) {
    diaryRef = diaryRef.where("rating", "==", rating);
  }

  if (releasedDecade !== null) {
    diaryRef = diaryRef.where("releasedDecade", "==", releasedDecade);
  }

  if (diaryYear !== null) {
    diaryRef = diaryRef.where("diaryYear", "==", diaryYear);
  }

  if (loggedBefore !== null) {
    diaryRef = diaryRef.where("loggedBefore", "==", loggedBefore);
  }

  if (genre !== null) {
    diaryRef = diaryRef.where("genre", "==", genre);
  }

  diaryRef = diaryRef.orderBy("diaryDate", "desc");

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

export async function fuegoDiaryAdd(
  uid: string,
  data: MediaDiary
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set({ id: diaryRef.id, ...data }, { merge: true });

  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

export async function fuegoDelete(
  uid: string,
  diaryId: string,
  data: MediaDiaryWithId
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.delete(diaryRef);

  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, -1);
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

export async function fuegoDiaryEntry(
  key: string,
  uid: string,
  diaryId: string
): Promise<MediaDiary | false> {
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  const diaryItem = await diaryRef.get();
  return (diaryItem.data() as MediaDiary) ?? false;
}

export async function fuegoEdit(
  uid: string,
  diaryId: string,
  data: MediaDiaryWithId,
  prevData: MediaDiaryWithId
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.update(diaryRef, data);

  const userRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");

  const fitlerEditSet = createFilterEditSet(data, prevData, [
    "rating",
    "releasedDecade",
    "loggedBefore",
    "diaryYear",
    "releasedYear",
  ]);

  userRef.set(fitlerEditSet, { merge: true });

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
