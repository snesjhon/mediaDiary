import { bookmarkFilterKeys, bookmarkFilterSet, fuegoDb } from "@/fuego";
import type { MediaDiaryDate, MediaMemory } from "@/types";
import {
  createFilterKeys,
  createFilterSet,
} from "../../../fuego/fuegoFilterActions";

export async function fuegoDiaryAdd(
  uid: string,
  data: MediaDiaryDate
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set({ id: diaryRef.id, ...data }, { merge: true });

  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb.collection(`/users/${uid}/filters`).doc("diary");
  filtersRef.set(filtersSetObj, { merge: true });

  if (data.rating > 0) {
    const memoriesKeys = bookmarkFilterKeys(data);
    const memoriesSetObj = bookmarkFilterSet(memoriesKeys, 1);
    const memoriesRef = fuegoDb
      .collection(`/users/${uid}/filters`)
      .doc("memories");
    memoriesRef.set(memoriesSetObj, { merge: true });
  }

  return batch.commit();
}

export async function fuegoLogRatingAdd(
  uid: string,
  data: MediaMemory
): Promise<void> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set({ id: diaryRef.id, ...data }, { merge: true });

  // We're only adding it to memories filter, because that's all we're adding
  // All diaries are memories, but not all memories are diaries.
  if (data.rating > 0) {
    const memoriesKeys = bookmarkFilterKeys(data);
    const memoriesSetObj = bookmarkFilterSet(memoriesKeys, 1);
    const memoriesRef = fuegoDb
      .collection(`/users/${uid}/filters`)
      .doc("memories");
    memoriesRef.set(memoriesSetObj, { merge: true });
  }

  return batch.commit();
}
