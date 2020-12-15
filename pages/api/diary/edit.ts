import type { NextApiRequest, NextApiResponse } from "next";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryEditHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;

  const parseReq = JSON.parse(body);

  const updates: {
    [key: string]: any;
  } = {};

  updates[`/users/${parseReq.uid}/diary/${parseReq.mediaId}`] = parseReq.data;

  await fuegoAdminDb.ref().update(updates, () => {
    res.status(200);
    res.end();
  });
}
export default diaryEditHandler;
