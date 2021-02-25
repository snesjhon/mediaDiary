import type fuego from "../fuego/fuego";
import type { MediaTypes } from "./typesMedia";

/** Structure edfor a user's preference set during NewUserFlow */
export interface UserPref {
  /** User's choice of media to track set during NewUserFlow */
  mediaTypes: MediaTypes;

  /** User's choice of theme set during NewUserFlow */
  theme: "light" | "dark";
}

/** User without validation */
export type UserFuego = fuego.User | null | false;

/** User that's been validated */
export type UserFuegoValidated = fuego.User;

/** User's preferences */
export type UserFuegoPref = UserPref | null | false;
