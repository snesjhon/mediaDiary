import type { DataFetchSpotify } from "@/config";
import { useDataFetch, useMDDispatch } from "@/config";
import { useFuegoUser } from "@/fuego";
import { BookmarkIcon } from "@/icons";
import MdLogo from "@/src/components/md/MdLogo";
import type { MDbMovie, MDbTV, MediaDiaryWithId } from "@/types";
import { createMediaSelected } from "@/utils";
import { CalendarIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { cache } from "swr";
import {
  MediaMovie,
  MediaSpotify,
  MediaTV,
} from "../../../../components/Media";
import MdLoader from "../../../md/MdLoader";
import {
  fuegoBookmarkAddWithId,
  fuegoBookmarkDelete,
  fuegoBookmarkDeleteWithId,
} from "../../fuego";

interface Props {
  mdData: MediaDiaryWithId;
  mutate: () => void;
}

export default function DayContent({ mdData, mutate }: Props): JSX.Element {
  const { user } = useFuegoUser();
  const dispatch = useMDDispatch();
  const {
    addedDate,
    bookmark,
    type,
    rating,
    diaryDate,
    artistId,
    mediaId,
    season,
    releasedDate,
    id,
    poster,
    artist,
    seenEpisodes,
  } = mdData;

  const { data, error, isLoading } = useDataFetch({
    type,
    firstId: mediaId,
    secondId: artistId,
    isSuspense: true,
  });

  const isEditable = addedDate === null || rating !== -1;

  if (error) {
    return <div>{error}</div>;
  }

  return isLoading || !data ? (
    <MdLoader />
  ) : (
    <>
      <DrawerHeader>
        <Flex justifyContent="space-between">
          <MdLogo title="mediaDiary" />
          <Flex alignItems="center">
            <IconButton
              aria-label="Search database"
              icon={
                <BookmarkIcon
                  fill={bookmark ? "orange.100" : "none"}
                  boxSize="5"
                />
              }
              variant="ghost"
              colorScheme="orange"
              mr="2"
              size="md"
              onClick={() =>
                bookmark ? removeBookmark(mdData, id) : addBookmark(mdData, id)
              }
            />
            <CloseButton />
          </Flex>
        </Flex>
      </DrawerHeader>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {type === "movie" && (
          <MediaMovie
            data={data as MDbMovie}
            diaryDate={diaryDate}
            rating={rating}
          />
        )}
        {type === "tv" && (
          <MediaTV
            data={data as MDbTV}
            diaryDate={diaryDate}
            artist={artist}
            rating={rating}
            seasonInfo={{ season, seenEpisodes }}
            poster={poster}
            releasedDate={releasedDate}
          />
        )}
        {type === "album" && (
          <MediaSpotify
            artistInfo={(data as DataFetchSpotify)[1]}
            albumInfo={(data as DataFetchSpotify)[0]}
            diaryDate={diaryDate}
            rating={rating}
          />
        )}
      </DrawerBody>
      <DrawerFooter
        borderTopWidth="1px"
        justifyContent="space-between"
        pb={{ base: 8, sm: 4 }}
      >
        {isEditable && (
          <Button
            onClick={handleLogAgain}
            colorScheme="blue"
            variant="outline"
            leftIcon={<RepeatIcon />}
          >
            Log again
          </Button>
        )}
        <Button
          // TODO: At the current moment there isn't a good way of adding SEASON support
          // AFTER you've bookmarked TV. That is inconvenient because I'd want to refecth
          // the seasons because we would want to have that dropdown. 03/17/21
          onClick={() =>
            dispatch({
              type: "edit",
              payload: {
                edit: mdData,
                editMovie: type === "movie" ? (data as MDbMovie) : undefined,
                editTV: type === "tv" ? (data as MDbTV) : undefined,
                editSpotify:
                  type === "album"
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
          {isEditable ? "Edit" : "Log"}
        </Button>
      </DrawerFooter>
    </>
  );

  function removeBookmark(mediaData: MediaDiaryWithId, id: string) {
    if (user && id) {
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
            dispatch({ type: "saved" });
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
            cache.delete([
              "/fuego/diaryById",
              user.uid,
              mediaData.type,
              mediaData.mediaId,
              mediaData.season ? mediaData.season : -1,
            ]);
            // TODO: might just want to roll this into a single dispatch, I believe i did this before because of
            // styling and FOUC issues.
            dispatch({ type: "view", payload: "md" });
            dispatch({ type: "saved" });
          });
      }
    } else {
      console.error("[CONTENT]: failed to remove a bookmark");
    }
  }

  function addBookmark(mediaData: MediaDiaryWithId, id: string) {
    if (user && id) {
      const { releasedDecade, releasedYear, type, genre, addedDate } =
        mediaData;
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
          dispatch({ type: "saved" });
          mutate();
        });
    } else {
      console.error("[CONTENT]: Failed to add a bookmark");
    }
  }

  function handleLogAgain() {
    if (data) {
      const mediaSelected = createMediaSelected(type, data, bookmark);
      if (mediaSelected) {
        dispatch({
          type: "logAgain",
          payload: {
            selected: mediaSelected,
            selectedMovie: type === "movie" ? (data as MDbMovie) : undefined,
            selectedTV: type === "tv" ? (data as MDbTV) : undefined,
            selectedSpotify:
              type === "album"
                ? {
                    artist: (data as DataFetchSpotify)[1],
                    album: (data as DataFetchSpotify)[0],
                  }
                : undefined,
          },
        });
      }
      return;
    }
  }
}
