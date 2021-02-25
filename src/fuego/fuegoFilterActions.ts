import firebase from "firebase/app";
import type { FilterData, Filters } from "../types/typesFilters";
import type { DiaryAdd } from "../types/typesMedia";
import { fuegoDb } from "./fuego";

export async function fuegoFiltersAll(
  key: string,
  uid: string
): Promise<FilterData> {
  const filterKeys = await fuegoDb
    .collection(`/users/${uid}/filters`)
    .doc("diary")
    .get();
  return {
    mediaType: filterKeys.get("mediaType") ?? {},
    diaryYear: filterKeys.get("diaryYear") ?? {},
    genre: filterKeys.get("genre") ?? {},
    loggedBefore: filterKeys.get("loggedBefore") ?? {},
    rating: filterKeys.get("rating") ?? {},
    releasedDecade: filterKeys.get("releasedDecade") ?? {},
    releasedYear: filterKeys.get("releasedYear") ?? {},
  };
}

export function createFilterSet(
  filters: Filters,
  incrementor: number
): Partial<firebase.firestore.DocumentData> {
  const setObj: Partial<firebase.firestore.DocumentData> = {};
  (Object.keys(filters) as Array<keyof Filters>).forEach((e) => {
    if (e === "diaryYear" && filters[e] !== null) {
      setObj[e] = {
        [`${filters[e]}`]: firebase.firestore.FieldValue.increment(incrementor),
      };
    } else if (filters[e] !== null) {
      setObj[e] = {
        [`${filters.diaryYear}`]: {
          [`${filters[e]}`]: firebase.firestore.FieldValue.increment(
            incrementor
          ),
        },
      };
    }
  });
  return setObj;
}

export function createFilterEditSet(
  data: DiaryAdd,
  prevData: DiaryAdd,
  comparison: Array<keyof Filters>
): Partial<firebase.firestore.DocumentData> {
  const newKeys = createFilterKeys(data);
  const oldKeys = createFilterKeys(prevData);

  // if the years are different then go through all of the keys,
  // if not then go through just the comparisons.
  const setObj: Partial<firebase.firestore.DocumentData> = {};
  if (newKeys.diaryYear !== oldKeys.diaryYear) {
    (Object.keys(newKeys) as Array<keyof Filters>).forEach((e) => {
      if (e === "diaryYear") {
        setObj[e] = {
          [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
          [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
        };
      } else {
        setObj[e] = {
          [`${oldKeys.diaryYear}`]: {
            [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
          },
          [`${newKeys.diaryYear}`]: {
            [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
          },
        };
      }
    });
  } else {
    comparison.forEach((e) => {
      if (newKeys[e] !== oldKeys[e]) {
        if (e === "diaryYear") {
          setObj[e] = {
            [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
            [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
          };
        } else {
          setObj[e] = {
            [`${newKeys.diaryYear}`]: {
              [`${oldKeys[e]}`]: firebase.firestore.FieldValue.increment(-1),
              [`${newKeys[e]}`]: firebase.firestore.FieldValue.increment(1),
            },
          };
        }
      }
    });
  }

  return setObj;
}

export function createFilterKeys(data: DiaryAdd): Filters {
  const releasedDecade = data.releasedDecade;
  const releasedYear = data.releasedYear;
  const diaryYear = data.diaryYear;
  const mediaType = data.type;
  const genreType = data.genre;
  const rating = data.rating * 2;
  const loggedBefore = data.loggedBefore;
  return {
    releasedDecade,
    releasedYear,
    diaryYear,
    mediaType,
    genre: genreType,
    rating,
    loggedBefore,
  };
}
