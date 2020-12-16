import type { NextApiRequest, NextApiResponse } from "next";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryEntryHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { entry },
  } = req;
  const userId = entry[0];
  const entryId = entry[1];

  await fuegoAdminDb
    .ref(`/users/${userId}/diary/${entryId}`)
    .once("value")
    .then((snapshot) => {
      const item = snapshot.val();
      return res.json(item);
    });
}
export default diaryEntryHandler;
