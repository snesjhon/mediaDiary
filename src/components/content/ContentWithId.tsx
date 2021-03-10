import { CalendarIcon } from "@chakra-ui/icons";
import { Button, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import React from "react";
import useSWR, { cache } from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import {
  fuegoBookmarkAddWithId,
  fuegoBookmarkDelete,
  fuegoBookmarkDeleteWithId,
} from "../../fuego/fuegoBookmarks";
import { fuegoDiaryEntry } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import BookmarkIcon from "../icons/BookmarkIcon";
import InfoBody from "../info/InfoBody";
import InfoHeader from "../info/InfoHeader";
import MdLoader from "../md/MdLoader";

function ContentWithId(): JSX.Element {
  const dispatch = useMDDispatch();
  const { edit } = useMDState();
  const { user } = useFuegoUser();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && edit ? ["/fuego/diaryDay", user.uid, edit.id] : null,
    fuegoDiaryEntry,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    const {
      artist,
      addedDate,
      bookmark,
      genre,
      poster,
      releasedDate,
      title,
      type,
      rating,
      diaryDate,
      artistId,
      mediaId,
      season,
      id,
    } = data;
    console.log(data);

    const isEditable = addedDate === null || rating !== -1;

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
            onClick={() =>
              bookmark ? removeBookmark(data, id) : addBookmark(data, id)
            }
            leftIcon={<BookmarkIcon fill={bookmark ? "orange.100" : "none"} />}
            colorScheme="orange"
            variant="outline"
          >
            {bookmark ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            onClick={() => dispatch({ type: "edit", payload: data })}
            colorScheme="purple"
            variant="outline"
            leftIcon={<CalendarIcon />}
          >
            {isEditable ? "Edit" : "Log"}
          </Button>
        </DrawerFooter>
      </>
    );
  }
  return <MdLoader />;

  function removeBookmark(mediaData: MediaDiaryWithId, id: string) {
    if (user !== null && user && user.email !== null && id) {
      const {
        diaryDate,
        rating,
        releasedYear,
        releasedDecade,
        type,
        genre,
        addedDate,
      } = mediaData;
      const filterData = {
        releasedDecade,
        releasedYear,
        type,
        genre,
        addedDate,
      };
      if (diaryDate || rating !== -1) {
        fuegoBookmarkDeleteWithId(user.uid, id, filterData)
          .then(() => {
            dispatch({ type: "saving" });
          })
          .finally(() => {
            dispatch({ type: "savedd" });
            mutate();
          });
      } else {
        fuegoBookmarkDelete(user.uid, id, filterData)
          .then(() => {
            dispatch({ type: "saving" });
          })
          .finally(() => {
            // In the case where we're deleting the item completely, we need to assure that our PREVIOUS
            // fetch case is refetched, the easiest way to assure this is to clear the cache.
            cache.delete(["/fuego/diaryById", user.uid, mediaData.mediaId]);
            // TODO: might just want to roll this into a single dispatch, I believe i did this before because of
            // styling and FOUC issues.
            dispatch({ type: "view", payload: "md" });
            dispatch({ type: "savedd" });
          });
      }
    } else {
      console.error("[CONTENT]: failed to remove a bookmark");
    }
  }

  function addBookmark(mediaData: MediaDiaryWithId, id: string) {
    if (user && id) {
      const {
        releasedDecade,
        releasedYear,
        type,
        genre,
        addedDate,
      } = mediaData;
      fuegoBookmarkAddWithId(user.uid, id, {
        releasedDecade,
        releasedYear,
        type,
        genre,
        addedDate,
      })
        .then(() => {
          dispatch({ type: "saving" });
        })
        .finally(() => {
          dispatch({ type: "savedd" });
          mutate();
        });
    } else {
      console.error("[CONTENT]: Failed to add a bookmark");
    }
  }
}

export default ContentWithId;
