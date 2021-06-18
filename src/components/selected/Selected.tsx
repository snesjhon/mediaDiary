import { CalendarIcon } from "@chakra-ui/icons";
import { Button, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { Suspense } from "react";
import useSWR from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import useDataFetch from "../../config/useDataFetch";
import type { DataFetchSpotify } from "../../config/useDataFetch";
import { fuegoBookmarkAdd } from "../../fuego/fuegoBookmarks";
import { fuegoDiaryById } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MDbMovie, MDbTV } from "../../types/typesMDb";
import type { MediaDiaryWithId, MediaSelected } from "../../types/typesMedia";
import type { SpotifyAlbum, SpotifyArtist } from "../../types/typesSpotify";
import { parsePosterUrl } from "../../utils/helpers";
import BookmarkIcon from "../icons/BookmarkIcon";
import MdLoader from "../md/MdLoader";
import SelectedMovie from "./components/SelectedMovie";
import SelectedSpotify from "./components/SelectedSpotify";
import SelectedTV from "./components/SelectedTV";

export default function Selected(): JSX.Element {
  const { user } = useFuegoUser();
  const { selected } = useMDState();
  const dispatch = useMDDispatch();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && selected
      ? [
          "/fuego/diaryById",
          user.uid,
          selected.type,
          selected.mediaId,
          selected.season ? selected.season : -1,
        ]
      : null,
    fuegoDiaryById,
    {
      revalidateOnFocus: false,
    }
  );

  if (!isValidating) {
    // if its TV then we have a problem, because if there IS a previous Item, then we have to realize
    // that we NEED to go search for a further season information.
    if (data) {
      // If we find this search has given us a result, then push to "SelectedWithId"
      dispatch({ type: "selectedWithId", payload: data });
      return <MdLoader />;
    } else if (selected) {
      return (
        <Suspense fallback={<MdLoader />}>
          <SelectedSuspense item={selected} mutate={mutate} />;
        </Suspense>
      );
    }
  }

  return <MdLoader />;
}

function SelectedSuspense({
  item,
  mutate,
}: {
  item: MediaSelected;
  mutate: () => void;
}) {
  const dispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const { data, error, isLoading } = useDataFetch({
    type: item.type,
    firstId: item.mediaId,
    secondId: item.artistId,
    isSuspense: true,
    season: item.season,
  });

  const parsedItem = parseData();

  if (error) {
    return <div>{error}</div>;
  }

  return isLoading || !parsedItem ? (
    <MdLoader />
  ) : (
    <>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {item.type === "album" && (
          <SelectedSpotify
            artistInfo={(data as DataFetchSpotify)[1]}
            albumInfo={(data as DataFetchSpotify)[0]}
          />
        )}
        {item.type === "movie" && <SelectedMovie data={data as MDbMovie} />}
        {item.type === "tv" && <SelectedTV data={data as MDbTV} />}
      </DrawerBody>
      <DrawerFooter
        borderTopWidth="1px"
        justifyContent="space-between"
        pb={{ base: 8, sm: 0 }}
      >
        <Button
          onClick={addBookmark}
          leftIcon={<BookmarkIcon />}
          colorScheme="orange"
          variant="outline"
        >
          Bookmark
        </Button>
        <Button
          onClick={() => dispatch({ type: "log", payload: parsedItem })}
          colorScheme="purple"
          variant="outline"
          leftIcon={<CalendarIcon />}
        >
          Log
        </Button>
      </DrawerFooter>
    </>
  );

  function parseData(): MediaSelected | false {
    if (data) {
      let parsedObj: Partial<MediaSelected> = {};
      if (item.type === "tv") {
        const castItem = data as MDbTV;

        if (castItem.seasons && castItem.seasons !== null) {
          const seasons = castItem.seasons.sort((_, b) =>
            b.season_number === 0 ? -1 : 1
          );

          // By default right now we want to save a season as -1, UNLESS the user chooses a specific season
          parsedObj = {
            seasons,
            season: -1,
            poster:
              castItem.poster_path !== null
                ? parsePosterUrl(castItem.poster_path, item.type)
                : "",
          };
        }

        if (castItem.genres) {
          parsedObj = {
            ...parsedObj,
            genre: castItem.genres[0].name,
          };
        }

        if (castItem.created_by && castItem.created_by.length > 0) {
          parsedObj = {
            ...parsedObj,
            artist: castItem.created_by.map((e) => e.name).join(", "),
          };
        }
      } else if (item.type === "movie") {
        const castItem = data as MDbMovie;

        if (castItem.credits.crew) {
          parsedObj = {
            artist:
              castItem.credits.crew.find((e) => e.job === "Director")?.name ??
              item.artist,
          };
        }
        if (castItem.genres) {
          parsedObj = {
            ...parsedObj,
            genre: castItem.genres[0].name,
          };
        }
      } else if (item.type === "album") {
        const castItem = data as [SpotifyAlbum, SpotifyArtist];
        parsedObj = {
          genre: (castItem[1].genres && castItem[1]?.genres[0]) ?? "none",
        };
      }

      return {
        ...item,
        ...parsedObj,
      };
    }
    return false;
  }

  async function addBookmark() {
    if (user && parsedItem) {
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
      } = parsedItem;

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
      dispatch({ type: "saving" });
      dispatch({ type: "savedd" });
      mutate();
    } else {
      console.error("[SELECTED]: No user");
    }
  }
}
