import { CalendarIcon } from "@chakra-ui/icons";
import { DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import { useMDDispatch } from "../../config/store";
import {
  fuegoBookmarkAdd,
  fuegoBookmarkDelete,
} from "../../fuego/fuegoBookmarks";
import { fuegoDiaryFieldEdit } from "../../fuego/fuegoMDActions";
import type {
  MediaDiary,
  MediaDiaryWithId,
  MediaSelected,
} from "../../types/typesMedia";
import type { UserFuego } from "../../types/typesUser";
import BookmarkIcon from "../icons/BookmarkIcon";
import StarEmptyIcon from "../icons/StartEmptyIcon";
import InfoBody from "../info/InfoBody";
import InfoHeader from "../info/InfoHeader";

interface Props {
  user: UserFuego;
  artist: MediaDiary["artist"];
  mediaId: MediaDiary["mediaId"];
  genre: MediaDiary["genre"];
  title: MediaDiary["title"];
  poster: MediaDiary["poster"];
  releasedDate: MediaDiary["releasedDate"];
  type: MediaDiary["type"];
  bookmark: MediaDiary["bookmark"];
  addedDate?: MediaDiary["addedDate"];
  artistId?: MediaDiary["artistId"];
  rating?: MediaDiary["rating"];
  season?: MediaDiary["season"];
  diaryDate?: MediaDiary["diaryDate"];
  id?: MediaDiaryWithId["id"];
}

function ContentData({
  rating,
  artist,
  artistId,
  mediaId,
  season,
  genre,
  title,
  poster,
  releasedDate,
  type,
  bookmark,
  diaryDate,
  addedDate,
  user,
  id,
}: Props): JSX.Element {
  const dispatch = useMDDispatch();
  const selected: MediaSelected = {
    artist,
    releasedDate,
    bookmark,
    genre,
    mediaId,
    poster,
    title,
    type,
    artistId,
  };

  const hasId = id && (bookmark || typeof rating !== "undefined");

  return (
    <>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        <InfoHeader
          artist={artist}
          genre={genre}
          poster={poster}
          releasedDate={releasedDate}
          title={title}
          type={type}
          rating={rating}
          diaryDate={diaryDate}
        />
        <InfoBody
          artistId={artistId}
          mediaId={mediaId}
          type={type}
          season={season}
        />
      </DrawerBody>
      <DrawerFooter borderTopWidth="1px" justifyContent="space-between">
        <Button
          onClick={bookmark ? removeBookmark : addBookmark}
          leftIcon={<BookmarkIcon fill={bookmark ? "orange.100" : "none"} />}
          colorScheme="orange"
          variant="outline"
        >
          {bookmark ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button
          // onClick={addBookmark}
          leftIcon={<StarEmptyIcon color="blue" />}
          colorScheme="blue"
          variant="outline"
        >
          Rate
        </Button>
        <Button
          onClick={
            () => {
              console.log("no good");
            }
            // hasId && id && addedDate
            //   ? dispatch({
            //       type: "day",
            //       // TODO: I'm convoluting too many things. Although it'd be great to have this
            //       // as a single component. I think it'd be better if we separate MediaSelected & MediaDiaryWithId
            //       payload: { id, ...selected, addedDate },
            //     })
            //   : dispatch({
            //       type: "log",
            //       payload: selected,
            //     })
          }
          colorScheme="purple"
          variant="outline"
          leftIcon={<CalendarIcon />}
        >
          {diaryDate ? "Edit Log" : "Log"}
        </Button>
      </DrawerFooter>
    </>
  );

  async function removeBookmark() {
    if (user !== null && user && user.email !== null && id) {
      dispatch({ type: "saving" });
      if (diaryDate || rating !== -1) {
        console.log("removed bookmark, but NOT the entry");
        await fuegoDiaryFieldEdit(user.uid, id, "bookmark", false);
        dispatch({ type: "savedd" });
      } else if (addedDate) {
        // remove bookmark, and entry, and MOVE information to Selected!
        const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
        const releasedDecade = Math.floor(releasedYear / 10) * 10;
        await fuegoBookmarkDelete(user.uid, id, {
          releasedDecade,
          releasedYear,
          type,
          genre,
          addedDate,
        });
        dispatch({
          type: "info",
          payload: {
            artist,
            releasedDate,
            bookmark: false,
            genre,
            mediaId,
            poster,
            title,
            type,
            artistId,
          },
        });
      }
    } else {
      console.error("[EDIT]: Missing delete params");
    }
  }

  async function addBookmark() {
    if (user) {
      dispatch({ type: "saving" });
      if (
        id &&
        (diaryDate || (rating !== -1 && typeof rating !== "undefined"))
      ) {
        await fuegoDiaryFieldEdit(user.uid, id, "bookmark", true);
      } else {
        const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
        await fuegoBookmarkAdd(user.uid, {
          releasedYear,
          releasedDecade: Math.floor(releasedYear / 10) * 10,
          addedDate: dayjs().toISOString(),
          type,
          genre,
          mediaId,
          poster,
          artist,
          title,
          releasedDate,
          bookmark: true,
          rating: -1,
          diaryDate: null,
          diaryYear: null,
          loggedBefore: false,
          ...(typeof artistId !== "undefined" && { artistId }),
          ...(typeof season !== "undefined" && { season }),
        });
      }
      dispatch({ type: "savedd" });
    }
  }
}

export default ContentData;
