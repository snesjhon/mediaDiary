import type { NextApiRequest, NextApiResponse } from "next";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { userId },
  } = req;
  await fuegoAdminDb
    .ref(`/users/${userId}/diary`)
    .once("value")
    .then((snapshot) => {
      const item = snapshot.val();
      return res.json(item);
    });
}
export default diaryUserHandler;
