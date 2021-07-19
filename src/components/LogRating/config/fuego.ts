import { bookmarkFilterKeys, bookmarkFilterSet, fuegoDb } from "@/fuego";
import type { MediaMemory } from "../../../types/typesMedia";

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
