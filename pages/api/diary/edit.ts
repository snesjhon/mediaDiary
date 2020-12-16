import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type { DiaryAdd } from "../../../src/config/mediaTypes";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryEditHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const body = JSON.parse(req.body);

  const uid = body.uid;
  const diaryId = body.diaryId;
  const editData: DiaryAdd = body.data;
  const prevYear = dayjs(body.prevDate).format("YYYY");
  const editYear = dayjs(editData.diaryDate).format("YYYY");

  const updates: {
    [key: string]: any;
  } = {};

  // If we have a mismatch year -- delete old year and update to new year
  if (prevYear !== editYear) {
    updates[`/users/${uid}/years/${prevYear}/${diaryId}`] = null;
    updates[`/users/${uid}/years/${editYear}/${diaryId}`] = true;
  }

  updates[`/users/${uid}/diary/${diaryId}`] = editData;

  await fuegoAdminDb.ref().update(updates, () => {
    res.status(200);
    res.end();
  });
}
export default diaryEditHandler;
