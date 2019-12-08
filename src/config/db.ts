import {
  FBKEY,
  FBDOMAIN,
  FBDBURL,
  FBPROJECTID,
  FBSTORAGE,
  FBMESSAGEID,
  FBAPPID
} from "./constants";
import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: FBKEY,
  authDomain: FBDOMAIN,
  databaseURL: FBDBURL,
  projectId: FBPROJECTID,
  storageBucket: FBSTORAGE,
  messagingSenderId: FBMESSAGEID,
  appId: FBAPPID
};

export const fb = firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore(fb);
