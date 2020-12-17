import dayjs from "dayjs";
import type { DiaryAdd } from "../config/mediaTypes";
import { fuegoDb } from "./fuego";

export async function fuegoDiaryGetAll(
  key: string,
  userId: string
): Promise<any> {
  const diaryItems = await fuegoDb.ref(`/users/${userId}/diary`).once("value");
  return diaryItems.val();
}

export async function fuegoDiaryGet(key: string, userId: string): Promise<any> {
  const diaryCount = await fuegoDb.ref(`/users/${userId}/count`).once("value");
  const diaryItems = await fuegoDb
    .ref(`/users/${userId}/diary`)
    .limitToLast(30)
    .once("value");

  return {
    diaryCount: diaryCount.val(),
    diaryItems: diaryItems.val(),
  };
}

export async function fuegoDiaryEntry(
  key: string,
  userId: string,
  diaryId: string
): Promise<DiaryAdd> {
  const diaryItem = await fuegoDb
    .ref(`/users/${userId}/diary/${diaryId}`)
    .once("value");

  return diaryItem.val();
}

export async function fuegoDiaryAdd(
  uid: string,
  data: DiaryAdd
): Promise<void> {
  const keyId = fuegoDb.ref().child("diary").push().key;

  const updates: {
    [key: string]: any;
  } = {};

  const year = dayjs(data.addedDate).format("YYYY");
  const mediaType = data.type;
  const genreType = data.genre;

  if (keyId !== null) {
    updates[`/users/${uid}/diary/${keyId}`] = data;

    if (year !== "") {
      updates[`/users/${uid}/years/${year}/${keyId}`] = true;
    }
    if (typeof mediaType !== "undefined") {
      updates[`/users/${uid}/type/${mediaType}/${keyId}`] = true;
    }
    if (typeof genreType !== "undefined" && genreType !== "") {
      updates[`/users/${uid}/genre/${genreType}/${keyId}`] = true;
    }
  }
  const countRef = fuegoDb.ref(`/users/${uid}/count`);
  await countRef.transaction(function (count) {
    return count + 1;
  });
  return await fuegoDb.ref().update(updates);
}

export async function fuegoDelete(
  uid: string,
  diaryId: string,
  data: DiaryAdd
): Promise<void> {
  const year = dayjs(data.addedDate).format("YYYY");
  const mediaType = data.type;
  const genreType = data.genre;

  const update: { [key: string]: any } = {};
  if (typeof diaryId !== "undefined") {
    update[`/users/${uid}/diary/${diaryId}`] = null;
  }
  if (typeof year !== "undefined") {
    update[`/users/${uid}/years/${year}/${diaryId}`] = null;
  }
  if (typeof mediaType !== "undefined") {
    update[`/users/${uid}/type/${mediaType}/${diaryId}`] = null;
  }
  if (typeof genreType !== "undefined") {
    update[`/users/${uid}/genre/${genreType}/${diaryId}`] = null;
  }
  const countRef = fuegoDb.ref(`/users/${uid}/count`);
  await countRef.transaction(function (count) {
    return count === 1 ? 0 : count - 1;
  });
  return await fuegoDb.ref().update(update);
}

export async function fuegoEdit(
  uid: string,
  diaryId: string,
  editData: DiaryAdd,
  prevDate: string
): Promise<void> {
  const prevYear = dayjs(prevDate).format("YYYY");
  const editYear = dayjs(editData.diaryDate).format("YYYY");

  const updates: {
    [key: string]: any;
  } = {};

  // If we have a mismatch year -- delete old year and update to new year
  if (prevYear !== editYear) {
    updates[`/users/${uid}/years/${prevYear}/${diaryId}`] = null;
    updates[`/users/${uid}/years/${editYear}/${diaryId}`] = true;
  }

  updates[`/users/${uid}/diary/${diaryId}`] = editData;

  return await fuegoDb.ref().update(updates);
}
