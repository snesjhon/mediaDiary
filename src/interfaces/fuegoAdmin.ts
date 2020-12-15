import * as fuegoAdmin from "firebase-admin";

if (!fuegoAdmin.apps.length) {
  fuegoAdmin.initializeApp({
    credential: fuegoAdmin.credential.cert({
      privateKey: process.env.NEXT_PUBLIC_FBSERVICE_KEY,
      clientEmail: process.env.NEXT_PUBLIC_FBSERVICE_EMAIL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

export default fuegoAdmin;
