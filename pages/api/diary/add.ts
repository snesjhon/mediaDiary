import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type { DiaryAdd } from "../../../src/config/mediaTypes";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryAddHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { body } = req;

  const parseReq = JSON.parse(body);
  const keyId = fuegoAdminDb.ref().child("diary").push().key;

  const updates: {
    [key: string]: any;
  } = {};

  const diaryItem: DiaryAdd = parseReq.data;
  const year = dayjs(diaryItem.addedDate).format("YYYY");
  const mediaType = diaryItem.type;
  const genreType = diaryItem.genre;

  if (keyId !== null) {
    updates[`/users/${parseReq.uid}/diary/${keyId}`] = parseReq.data;
    if (year !== "") {
      updates[`/users/${parseReq.uid}/years/${year}/${keyId}`] = true;
    }
    if (typeof mediaType !== "undefined") {
      updates[`/users/${parseReq.uid}/type/${mediaType}/${keyId}`] = true;
    }
    if (typeof genreType !== "undefined" && genreType !== "") {
      updates[`/users/${parseReq.uid}/genre/${genreType}/${keyId}`] = true;
    }
  }

  await fuegoAdminDb.ref().update(updates, () => {
    res.status(200);
    res.end();
  });
}
export default diaryAddHandler;
