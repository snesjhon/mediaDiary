import firebase from "firebase/app";
import type {
  DiaryAdd,
  DiaryAddWithId,
  FilterData,
  Filters,
  MediaTypes,
} from "../config/types";
import { fuegoDb } from "./fuego";

export async function fuegoDiaryGet(
  key: string,
  uid: string,
  cursor: string,
  mediaTypes: MediaTypes[] | null,
  rating: number | null,
  releasedDecade: number | null,
  diaryYear: number | null,
  loggedBefore: boolean | null,
  genre: string | null
): Promise<DiaryAddWithId[]> {
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

  diaryRef = diaryRef.orderBy("diaryDate", "desc");

  if (cursor !== null) {
    diaryRef = diaryRef.startAfter(cursor);
  }

  const diaryItems = await diaryRef.limit(30).get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });

  return items;
}

export async function fuegoDiaryAdd(uid: string, data: DiaryAdd): Promise<any> {
  const batch = fuegoDb.batch();
  const diaryRef = fuegoDb.collection(`users/${uid}/diary`).doc();
  diaryRef.set({ id: diaryRef.id, ...data }, { merge: true });

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

export async function fuegoFiltersAll(
  key: string,
  uid: string
): Promise<FilterData> {
  const filterKeys = await fuegoDb.collection("users").doc(uid).get();
  return filterKeys.data() as FilterData;
}

export async function fuegoChartYear(
  key: string,
  uid: string,
  diaryYear: number | null,
  mediaType: MediaTypes | null,
  loggedBefore: boolean | null
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as firebase.firestore.Query;

  diaryRef = diaryRef.where("diaryYear", "==", diaryYear);

  if (mediaType !== null) {
    diaryRef = diaryRef.where("type", "==", mediaType);
  }

  if (loggedBefore !== null) {
    diaryRef = diaryRef.where("loggedBefore", "==", loggedBefore);
  }

  const diaryItems = await diaryRef.get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });

  return items;
}

export async function fuegoTop5(
  key: string,
  uid: string,
  year: number | null
): Promise<DiaryAddWithId[]> {
  let diaryRef = fuegoDb.collection(
    `users/${uid}/diary`
  ) as firebase.firestore.Query;

  if (year !== null) {
    diaryRef = diaryRef.where("diaryYear", "==", year);
  }
  diaryRef = diaryRef.orderBy("rating", "asc");

  const diaryItems = await diaryRef.limit(5).get();

  const items: DiaryAddWithId[] = [];
  diaryItems.forEach((item) => {
    items.push(item.data() as DiaryAddWithId);
  });
  return items;
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
    if (e === "filterDiaryYear" && filters[e] !== null) {
      setObj[e] = {
        [`${filters[e]}`]: firebase.firestore.FieldValue.increment(incrementor),
      };
    } else if (filters[e] !== null) {
      setObj[e] = {
        [`${filters.filterDiaryYear}`]: {
          [`${filters[e]}`]: firebase.firestore.FieldValue.increment(
            incrementor
          ),
        },
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

  // if the years are different then go through all of the keys,
  // if not then go through just the comparisons.
  const setObj: Partial<firebase.firestore.DocumentData> = {};
  if (newKeys.filterDiaryYear !== oldKeys.filterDiaryYear) {
    (Object.keys(newKeys) as Array<keyof Filters>).forEach((e) => {
      if (e === "filterDiaryYear") {
        setObj[e] = {
          [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
          [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
        };
      } else {
        setObj[e] = {
          [`${oldKeys.filterDiaryYear}`]: {
            [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
          },
          [`${newKeys.filterDiaryYear}`]: {
            [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
          },
        };
      }
    });
  } else {
    comparison.forEach((e) => {
      if (newKeys[e] !== oldKeys[e]) {
        if (e === "filterDiaryYear") {
          setObj[e] = {
            [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
            [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
          };
        } else {
          setObj[e] = {
            [`${oldKeys.filterDiaryYear}`]: {
              [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
            },
            [`${newKeys.filterDiaryYear}`]: {
              [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
            },
          };
        }
      }
    });
  }

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
