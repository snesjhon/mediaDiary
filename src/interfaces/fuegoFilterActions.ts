import firebase from "firebase/app";
import type { FilterData, Filters, DiaryAdd } from "../config/types";
import { fuegoDb } from "./fuego";

export async function fuegoFiltersAll(
  key: string,
  uid: string
): Promise<FilterData> {
  const filterKeys = await fuegoDb.collection("users").doc(uid).get();
  return filterKeys.data() as FilterData;
}

export function createFilterSet(
  filters: Filters,
  incrementor: number
): Partial<firebase.firestore.DocumentData> {
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
            [`${newKeys.filterDiaryYear}`]: {
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
    filterReleasedDecade: releasedDecade,
    filterReleasedYear: releasedYear,
    filterDiaryYear: diaryYear,
    filterMediaType: mediaType,
    filterGenre: genreType,
    filterRating: rating,
    filterLoggedBefore: loggedBefore,
  };
}
