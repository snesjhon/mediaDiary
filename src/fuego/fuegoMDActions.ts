import { fuegoDb } from "./fuego";
import type fuego from "./fuego";
import {
  createFilterKeys,
  createFilterSet,
  createFilterEditSet,
} from "./fuegoFilterActions";
import type {
  MediaDiary,
  MediaDiaryDate,
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
  // using this I'm able to filter based on this type and then I'll able to manipulate how they're displayed?
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

  diaryRef = diaryRef.where("diaryDate", "!=", null);
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
  data: MediaDiaryDate
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set({ id: diaryRef.id, typeLog: "diary", ...data }, { merge: true });

  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

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
  mediaId: string
): Promise<MediaDiaryWithId | false> {
  const diaryRef = fuegoDb
    .collection(`users/${uid}/diary`)
    .where("mediaId", "==", mediaId);

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
