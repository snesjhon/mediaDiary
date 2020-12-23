import type { MDState } from "../config/store";
import type { MediaTypes } from "../config/types";
import type { FuegoValidatedUser } from "../interfaces/fuegoProvider";

export type MDKeyArray = [
  string,
  string,
  string | null,
  MediaTypes[] | null,
  number | null,
  number | null,
  number | null,
  boolean | null,
  string | null
];
/**
 * **createSWRKey**
 * - SWR keys are passed parameters through an array, so in order to keep a "global"
 *   key of what's currently in the MediaDiaryList then create the SWR key
 */
function createMDKey(
  user: FuegoValidatedUser,
  state: MDState,
  cursor: string | null = null
): MDKeyArray {
  const {
    filterMediaType,
    filterRating,
    filterReleasedDecade,
    filterDiaryYear,
    filterLoggedBefore,
    filterGenre,
  } = state;
  const defaultKey: MDKeyArray = [
    "/fuego/diary",
    user.uid,
    cursor,
    filterMediaType !== null ? filterMediaType : null,
    filterRating !== null ? filterRating : null,
    filterReleasedDecade !== null ? filterReleasedDecade : null,
    filterDiaryYear !== null ? filterDiaryYear : null,
    filterLoggedBefore !== null ? filterLoggedBefore : null,
    filterGenre !== null ? filterGenre : null,
  ];
  return defaultKey;
}
export default createMDKey;
