import fuego from "firebase/app";
import "firebase/auth";
import "firebase/database";

if (!fuego.apps.length) {
  fuego.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE,
  });
} else {
  fuego.app();
}

export const fuegoDb = fuego.database();

export default fuego;
