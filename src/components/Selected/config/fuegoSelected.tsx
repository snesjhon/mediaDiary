import type { MediaDiaryWithId, MediaType } from "../../../types/typesMedia";
import type fuego from "../../../fuego/fuego";
import { fuegoDb } from "../../../fuego/fuego";

export default async function fuegoDiaryById(
  key: string,
  uid: string,
  type: MediaType,
  mediaId: string
): Promise<MediaDiaryWithId | false> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as fuego.firestore.Query;
  diaryRef = diaryRef.where("mediaId", "==", mediaId);

  // We looking up by TV, we never want to get the specific season
  if (type === "tv") {
    diaryRef = diaryRef.where("season", "==", -1);
  }

  const diaryItems = await diaryRef.limit(1).get();

  const items: MediaDiaryWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as MediaDiaryWithId);
  });

  return items.length > 0 ? items[0] : false;
}
