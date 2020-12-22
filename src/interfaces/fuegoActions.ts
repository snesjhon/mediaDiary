import firebase from "firebase/app";
import type { DiaryAdd, DiaryState, MediaTypes } from "../config/types";
import type { Filters } from "../config/types";
import { fuegoDb } from "./fuego";

export async function fuegoDiaryGet(
  key: string,
  uid: string,
  page: number,
  mediaTypes: MediaTypes[] | null,
  rating: number | null,
  releasedDecade: number | null,
  diaryYear: number | null,
  loggedBefore: boolean | null,
  genre: string | null
): Promise<DiaryState> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as firebase.firestore.Query;

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

  const diaryItems = await diaryRef.limit(30).get();

  const items: DiaryState = {};
  diaryItems.forEach((item) => {
    items[item.id] = item.data() as DiaryAdd;
  });
  return items;
}

export async function fuegoDiaryAdd(uid: string, data: DiaryAdd): Promise<any> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set(data, { merge: true });

  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, 1);
  const filtersRef = fuegoDb.collection("users").doc(uid);
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

export async function fuegoDelete(
  uid: string,
  diaryId: string,
  data: DiaryAdd
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.delete(diaryRef);

  const filtersRef = fuegoDb.collection("users").doc(uid);
  const filtersKeys = createFilterKeys(data);
  const filtersSetObj = createFilterSet(filtersKeys, -1);
  filtersRef.set(filtersSetObj, { merge: true });

  return batch.commit();
}

export async function fuegoFiltersAll(key: string, uid: string): Promise<any> {
  const filterKeys = await fuegoDb.collection("users").doc(uid).get();
  return filterKeys.data();
}

export async function fuegoDiaryEntry(
  key: string,
  uid: string,
  diaryId: string
): Promise<DiaryAdd | false> {
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  const diaryItem = await diaryRef.get();
  return (diaryItem.data() as DiaryAdd) ?? false;
}

export async function fuegoEdit(
  uid: string,
  diaryId: string,
  data: DiaryAdd,
  prevData: DiaryAdd
): Promise<void> {
  const batch = fuegoDb.batch();

  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc(diaryId);
  batch.update(diaryRef, data);

  const userRef = fuegoDb.collection("users").doc(uid);

  const fitlerEditSet = createFilterEditSet(data, prevData, [
    "filterRating",
    "filterReleasedDecade",
    "filterLoggedBefore",
    "filterDiaryYear",
    "filterReleasedYear",
  ]);

  userRef.set(fitlerEditSet, { merge: true });

  return batch.commit();
}

function createFilterSet(filters: Filters, incrementor: number) {
  const setObj: Partial<firebase.firestore.DocumentData> = {};
  (Object.keys(filters) as Array<keyof Filters>).forEach((e) => {
    if (filters[e] !== null) {
      setObj[e] = {
        [`${filters[e]}`]: firebase.firestore.FieldValue.increment(incrementor),
      };
    }
  });
  return setObj;
}

function createFilterEditSet(
  data: DiaryAdd,
  prevData: DiaryAdd,
  comparison: Array<keyof Filters>
) {
  const newKeys = createFilterKeys(data);
  const oldKeys = createFilterKeys(prevData);

  const setObj: Partial<firebase.firestore.DocumentData> = {};
  comparison.forEach((e) => {
    if (newKeys[e] !== oldKeys[e]) {
      setObj[e] = {
        [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
        [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
      };
    }
  });
  return setObj;
}

function createFilterKeys(data: DiaryAdd): Filters {
  const releasedDecade = data.releasedDecade;
  const releasedYear = data.releasedYear;
  const diaryYear = data.diaryYear;
  const mediaType = data.type;
  const genreType = data.genre;
  const rating = data.rating * 2;
  const loggedBefore = data.loggedBefore;
  return {
    filterReleasedDecade: releasedDecade,
    filterReleasedYear: releasedYear,
    filterDiaryYear: diaryYear,
    filterMediaType: mediaType,
    filterGenre: genreType,
    filterRating: rating,
    filterLoggedBefore: loggedBefore,
  };
}
