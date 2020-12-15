import type { NextApiRequest, NextApiResponse } from "next";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

function diaryAddHandler(req: NextApiRequest, res: NextApiResponse): void {
  const { body } = req;

  const parseReq = JSON.parse(body);
  const keyId = fuegoAdminDb.ref().child("diary").push().key;
  const updates: {
    [key: string]: any;
  } = {};
  updates[`/users/${parseReq.uid}/diary/${keyId}`] = parseReq.data;

  fuegoAdminDb.ref().update(updates, () => {
    res.status(200);
    res.end();
  });
}
export default diaryAddHandler;
