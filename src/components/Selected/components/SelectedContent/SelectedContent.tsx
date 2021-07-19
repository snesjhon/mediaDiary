import dayjs from "dayjs";
import React from "react";
import { useMDDispatch } from "../../../../config/store";
import useDataFetch from "../../../../config/useDataFetch";
import type { DataFetchSpotify } from "../../../../config/useDataFetch";
import { fuegoBookmarkAdd } from "../../../../fuego/fuegoBookmarks";
import useFuegoUser from "../../../../fuego/useFuegoUser";
import type { MDbMovie, MDbTV } from "../../../../types/typesMDb";
import type { MediaSelected } from "../../../../types/typesMedia";
import { CalendarIcon } from "@chakra-ui/icons";
import { DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import MdLoader from "../../../md/MdLoader";
import { MediaSpotify, MediaMovie, MediaTV } from "../../../Media";
import { createMediaSelected } from "@/utils";
import { BookmarkIcon } from "@/icons";

export default function SelectedContent({
  item,
  mutate,
}: {
  item: MediaSelected;
  mutate: () => void;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const { data, error, isLoading } = useDataFetch({
    type: item.type,
    firstId: item.mediaId,
    secondId: item.artistId,
    isSuspense: true,
    season: item.season,
  });

  const mediaSelected = createMediaSelected(item.type, data);

  if (error) {
    return <div>{error}</div>;
  }

  return isLoading || !mediaSelected ? (
    <MdLoader />
  ) : (
    <>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {item.type === "album" && (
          <MediaSpotify
            artistInfo={(data as DataFetchSpotify)[1]}
            albumInfo={(data as DataFetchSpotify)[0]}
          />
        )}
        {item.type === "movie" && <MediaMovie data={data as MDbMovie} />}
        {item.type === "tv" && <MediaTV data={data as MDbTV} />}
      </DrawerBody>
      <DrawerFooter
        borderTopWidth="1px"
        justifyContent="space-between"
        pb={{ base: 8, sm: 0 }}
      >
        <Button
          id="selectedBookmark"
          onClick={addBookmark}
          leftIcon={<BookmarkIcon />}
          colorScheme="orange"
          variant="outline"
        >
          Bookmark
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: "log",
              payload: {
                selected: mediaSelected,
                selectedMovie:
                  item.type === "movie" ? (data as MDbMovie) : undefined,
                selectedTV: item.type === "tv" ? (data as MDbTV) : undefined,
                selectedSpotify:
                  item.type === "album"
                    ? {
                        artist: (data as DataFetchSpotify)[1],
                        album: (data as DataFetchSpotify)[0],
                      }
                    : undefined,
              },
            })
          }
          colorScheme="purple"
          variant="outline"
          leftIcon={<CalendarIcon />}
        >
          Log
        </Button>
      </DrawerFooter>
    </>
  );

  async function addBookmark() {
    if (user && mediaSelected) {
      const {
        releasedDate,
        genre,
        mediaId,
        poster,
        artist,
        artistId,
        season,
        type,
        title,
      } = mediaSelected;

      const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
      await fuegoBookmarkAdd(user.uid, {
        releasedYear,
        releasedDecade: Math.floor(releasedYear / 10) * 10,
        addedDate: dayjs().toISOString(),
        type,
        genre: genre !== "" ? genre.toLocaleLowerCase() : "",
        mediaId,
        poster,
        artist,
        title,
        releasedDate,
        bookmark: true,
        rating: 0,
        diaryDate: false,
        diaryYear: false,
        loggedBefore: false,
        ...(typeof artistId !== "undefined" && { artistId }),
        ...(typeof season !== "undefined" && { season }),
      });
      dispatch({ type: "saving" });
      dispatch({ type: "saved" });
      mutate();
    } else {
      console.error("[SELECTED]: No user");
    }
  }
}
