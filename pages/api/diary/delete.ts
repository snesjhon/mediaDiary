import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import type { DiaryAdd } from "../../../src/config/mediaTypes";
import fuegoAdminDb from "../../../src/interfaces/fuegoAdminDb";

async function diaryDeleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const body = JSON.parse(req.body);
  const data: DiaryAdd = body.data;

  const uid = body.uid;
  const diaryId = body.diaryId;
  const year = dayjs(data.addedDate).format("YYYY");
  const mediaType = data.type;
  const genreType = data.genre;

  const update: { [key: string]: any } = {};
  if (typeof diaryId !== "undefined") {
    update[`/users/${uid}/diary/${diaryId}`] = null;
  }
  if (typeof year !== "undefined") {
    update[`/users/${uid}/years/${year}/${diaryId}`] = null;
  }
  if (typeof mediaType !== "undefined") {
    update[`/users/${uid}/type/${mediaType}/${diaryId}`] = null;
  }
  if (typeof genreType !== "undefined") {
    update[`/users/${uid}/genre/${genreType}/${diaryId}`] = null;
  }
  await fuegoAdminDb.ref().update(update, () => {
    res.status(200);
    res.end();
  });
}
export default diaryDeleteHandler;
