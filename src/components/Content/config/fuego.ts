import { fuegoDb } from "@/fuego";

export async function fuegoDiarySearch(
  key: string,
  uid: string,
  query: string
): Promise<any | false> {
  const diaryRef = fuegoDb
    .collection(`users/${uid}/diary`)
    .where("search_title", "array-contains", query.toLocaleLowerCase());

  const diaryItem = await diaryRef.limit(30).get();
  return diaryItem.docs.map((e) => e.data()) ?? false;
}
