import type { NextApiRequest, NextApiResponse } from "next";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

function diaryDeleteHandler(req: NextApiRequest, res: NextApiResponse): void {
  const { body } = req;

  const parseReq = JSON.parse(body);

  fuegoAdminDb
    .ref(`/users/${parseReq.uid}/diary/${parseReq.mediaId}`)
    .remove()
    .then(() => {
      res.status(200);
      res.end();
    });
}
export default diaryDeleteHandler;
