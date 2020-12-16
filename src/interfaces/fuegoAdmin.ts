import * as fuegoAdmin from "firebase-admin";

if (!fuegoAdmin.apps.length) {
  try {
    fuegoAdmin.initializeApp({
      credential: fuegoAdmin.credential.cert({
        privateKey:
          typeof process.env.NEXT_PUBLIC_FBSERVICE_KEY !== "undefined"
            ? process.env.NEXT_PUBLIC_FBSERVICE_KEY.replace(/\\n/g, "\n")
            : "",
        clientEmail: process.env.NEXT_PUBLIC_FBSERVICE_EMAIL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
      // eslint-disable-next-line no-console
      console.error("Firebase admin initialization error", error.stack);
    }
  }
}

export default fuegoAdmin;
