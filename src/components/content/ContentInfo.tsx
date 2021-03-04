import { CalendarIcon, StarIcon } from "@chakra-ui/icons";
import { Button, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import useSWR from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import useDataFetch from "../../config/useDataFetch";
import { fuegoBookmarkAdd } from "../../fuego/fuegoBookmarks";
import { fuegoDiaryById } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MDbMovie, MDbTV } from "../../types/typesMDb";
import type { MediaDiaryWithId, MediaSelected } from "../../types/typesMedia";
import type { SpotifyAlbum, SpotifyArtist } from "../../types/typesSpotify";
import type { UserFuego } from "../../types/typesUser";
import { parsePosterUrl } from "../../utils/helpers";
import BookmarkIcon from "../icons/BookmarkIcon";
import StarEmptyIcon from "../icons/StartEmptyIcon";
import InfoBody from "../info/InfoBody";
import InfoHeader from "../info/InfoHeader";
import MdLoader from "../md/MdLoader";

// Can this be bookmarked AND diaryed?
function ContentInfo(): JSX.Element {
  const { selected, view, isSaving } = useMDState();
  const { user } = useFuegoUser();
  const { data, isValidating, error, mutate } = useSWR<
    Partial<MediaDiaryWithId> | false
  >(
    user && selected ? ["/fuego/diaryById", user.uid, selected.mediaId] : null,
    fuegoDiaryById,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (isSaving) {
      mutate();
    }
  }, [isSaving, mutate]);

  // TODO: this assumes we have some data that we're able to get information about, and add /delete information on.
  //

  if (view === "info" && selected && user && !isValidating) {
    if (data) {
      return <InfoPrevious item={data} user={user} />;
    } else {
      return <InfoSelected item={selected} user={user} />;
    }
  }

  // if (data && view === "info") {
  //   console.log(data);
  // }
  // TODO: If we have an identified Item from our database then we don't have to do the external lookup
  // WE can have the extenal lookup for the SEASONS  if there's a database that exists so we don't breakup the
  // current datafetch that we have right now.

  return <MdLoader />;
}
function InfoPrevious({
  item,
  user,
}: {
  item: Partial<MediaDiaryWithId>;
  user: UserFuego;
}) {
  const {
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
    diaryDate,
  } = item;
  return (
    <>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {artist && genre && title && poster && releasedDate && type && (
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
        )}
        {mediaId && type && (
          <InfoBody
            artistId={artistId}
            mediaId={mediaId}
            type={type}
            season={season}
          />
        )}
      </DrawerBody>
    </>
  );
}

function InfoSelected({
  item,
  user,
}: {
  item: MediaSelected;
  user: UserFuego;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const { data, error, isLoading } = useDataFetch({
    type: item.type,
    firstId: item.mediaId,
    secondId: item.artistId,
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
        <InfoHeader {...parsedItem} />
        <InfoBody
          artistId={parsedItem.artistId}
          mediaId={parsedItem.mediaId}
          type={parsedItem.type}
          season={parsedItem?.season}
        />
      </DrawerBody>
      <DrawerFooter borderTopWidth="1px" justifyContent="space-between">
        <Button
          onClick={addBookmark}
          leftIcon={<BookmarkIcon />}
          colorScheme="orange"
          variant="outline"
        >
          Bookmark
        </Button>
        <Button
          onClick={addBookmark}
          leftIcon={<StarEmptyIcon color="blue" />}
          colorScheme="blue"
          variant="outline"
        >
          Rate
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: "log",
              payload: parsedItem,
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
    if (user && parsedItem) {
      // Normally I'd use destruct, but it throws a TS warning
      // since I'm not going to use seasons for anything
      const copied = Object.assign({}, parsedItem);
      delete copied.seasons;
      const releasedYear = parseInt(dayjs(copied.releasedDate).format("YYYY"));

      dispatch({ type: "saving" });
      await fuegoBookmarkAdd(user.uid, {
        ...copied,
        bookmark: true,
        releasedYear,
        releasedDecade: Math.floor(releasedYear / 10) * 10,
        addedDate: dayjs().toISOString(),
        rating: -1,
        diaryDate: null,
        diaryYear: null,
        loggedBefore: false,
      });
      dispatch({ type: "savedd" });
    }
  }

  function parseData(): MediaSelected | false {
    if (data) {
      let parsedObj: Partial<MediaSelected> = {};
      if (item.type === "tv") {
        const castItem = data as MDbTV;

        if (castItem.seasons && castItem.seasons !== null) {
          const seasons = castItem.seasons.sort((_, b) =>
            b.season_number === 0 ? -1 : 1
          );
          const seasonItem = seasons[0];
          parsedObj = {
            seasons,
            season: seasonItem.season_number,
            episodes: seasonItem.episode_count,
            poster:
              castItem.poster_path !== null
                ? parsePosterUrl(castItem.poster_path, item.type)
                : "",
            releasedDate: dayjs(seasonItem.air_date).toISOString(),
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
}

export default ContentInfo;
