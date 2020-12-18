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

export async function fuegoDiaryGet(
  key: string,
  userId: string,
  page: number
): Promise<any> {
  const diaryItems = await fuegoDb
    .ref(`/users/${userId}/diary`)
    .orderByChild("diaryDate")
    .limitToLast(30 * page)
    .once("value");

  return diaryItems.val();
}

export async function fuegoDiaryCount(
  key: string,
  userId: string
): Promise<void> {
  const diaryCount = await fuegoDb.ref(`/users/${userId}/count`).once("value");
  return diaryCount.val();
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

  const year = dayjs(data.diaryDate).format("YYYY");
  const mediaType = data.type;
  const genreType = data.genre;

  if (keyId !== null) {
    updates[`/users/${uid}/diary/${keyId}`] = data;
    updates[`/users/${uid}/keys/diary/${keyId}`] = true;

    if (year !== "") {
      updates[`/users/${uid}/years/${year}/${keyId}`] = data;
      updates[`/users/${uid}/keys/years/${year}/${keyId}`] = true;
    }
    if (typeof mediaType !== "undefined") {
      updates[`/users/${uid}/type/${mediaType}/${keyId}`] = data;
      updates[`/users/${uid}/keys/type/${mediaType}/${keyId}`] = true;
    }
    if (typeof genreType !== "undefined" && genreType !== "") {
      updates[`/users/${uid}/genre/${genreType}/${keyId}`] = data;
      updates[`/users/${uid}/keys/genre/${genreType}/${keyId}`] = true;
    }
  }
  return await fuegoDb.ref().update(updates);
}

export async function fuegoDelete(
  uid: string,
  diaryId: string,
  data: DiaryAdd
): Promise<void> {
  const year = dayjs(data.diaryDate).format("YYYY");
  const mediaType = data.type;
  const genreType = data.genre;

  const update: { [key: string]: any } = {};
  if (typeof diaryId !== "undefined") {
    update[`/users/${uid}/diary/${diaryId}`] = null;
    update[`/users/${uid}/keys/diary/${diaryId}`] = null;
  }
  if (typeof year !== "undefined") {
    update[`/users/${uid}/years/${year}/${diaryId}`] = null;
    update[`/users/${uid}/keys/years/${year}/${diaryId}`] = null;
  }
  if (typeof mediaType !== "undefined") {
    update[`/users/${uid}/type/${mediaType}/${diaryId}`] = null;
    update[`/users/${uid}/keys/type/${mediaType}/${diaryId}`] = null;
  }
  if (typeof genreType !== "undefined") {
    update[`/users/${uid}/genre/${genreType}/${diaryId}`] = null;
    update[`/users/${uid}/keys/genre/${genreType}/${diaryId}`] = null;
  }
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
  const mediaType = editData.type;
  const genreType = editData.genre;
  const updates: {
    [key: string]: any;
  } = {};

  // If we have a mismatch year -- delete old year and update to new year
  if (prevYear !== editYear) {
    updates[`/users/${uid}/years/${prevYear}/${diaryId}`] = null;
    updates[`/users/${uid}/keys/years/${prevYear}/${diaryId}`] = null;
    updates[`/users/${uid}/keys/years/${editYear}/${diaryId}`] = true;
  }

  updates[`/users/${uid}/diary/${diaryId}`] = editData;

  if (editYear !== "") {
    updates[`/users/${uid}/years/${editYear}/${diaryId}`] = editData;
  }
  if (typeof mediaType !== "undefined") {
    updates[`/users/${uid}/type/${mediaType}/${diaryId}`] = editData;
  }
  if (typeof genreType !== "undefined" && genreType !== "") {
    updates[`/users/${uid}/genre/${genreType}/${diaryId}`] = editData;
  }
  return await fuegoDb.ref().update(updates);
}
