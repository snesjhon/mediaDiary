import { fuegoDb } from "@/fuego";
import {
  createFilterKeys,
  createFilterSet,
} from "../../../fuego/fuegoFilterActions";
import type { MediaDiaryDate } from "../../../types/typesMedia";

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

  return batch.commit();
}
