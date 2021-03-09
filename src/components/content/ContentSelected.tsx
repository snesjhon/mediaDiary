import { CalendarIcon } from "@chakra-ui/icons";
import { DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { type } from "os";
import { title } from "process";
import React from "react";
import { useMDDispatch } from "../../config/store";
import useDataFetch from "../../config/useDataFetch";
import { fuegoBookmarkAdd } from "../../fuego/fuegoBookmarks";
import type { MDbTV, MDbMovie } from "../../types/typesMDb";
import type { MediaSelected } from "../../types/typesMedia";
import type { SpotifyAlbum, SpotifyArtist } from "../../types/typesSpotify";
import type { UserFuego } from "../../types/typesUser";
import { parsePosterUrl } from "../../utils/helpers";
import BookmarkIcon from "../icons/BookmarkIcon";
import StarEmptyIcon from "../icons/StartEmptyIcon";
import InfoBody from "../info/InfoBody";
import InfoHeader from "../info/InfoHeader";
import MdLoader from "../md/MdLoader";
import ContentData from "./ContentData";

function ContentSelected({
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
    // <ContentData user={user} {...parsedItem} />
    <>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        <InfoHeader
          artist={parsedItem.artist}
          genre={parsedItem.genre}
          poster={parsedItem.poster}
          releasedDate={parsedItem.releasedDate}
          title={parsedItem.title}
          type={parsedItem.type}
          // rating={parsedItem.rating}
          // diaryDate={parsedItem.diaryDate}
        />
        <InfoBody
          artistId={parsedItem.artistId}
          mediaId={parsedItem.mediaId}
          type={parsedItem.type}
          season={parsedItem.season}
        />
      </DrawerBody>
      <DrawerFooter borderTopWidth="1px" justifyContent="space-between">
        <Button
          onClick={addBookmark}
          // onClick={bookmark ? removeBookmark : addBookmark}
          leftIcon={<BookmarkIcon />}
          colorScheme="orange"
          variant="outline"
        >
          Bookmark
          {/* {bookmark ? "Bookmarked" : "Bookmark"} */}
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
          Log
          {/* {parsedItem.diaryDate ? "Edit Log" : "Log"} */}
        </Button>
      </DrawerFooter>
    </>
  );

  // async function removeBookmark() {
  //   if (user !== null && user && user.email !== null && id) {
  //     dispatch({ type: "saving" });
  //     if (diaryDate || rating !== -1) {
  //       console.log("removed bookmark, but NOT the entry");
  //       await fuegoDiaryFieldEdit(user.uid, id, "bookmark", false);
  //       dispatch({ type: "savedd" });
  //     } else if (addedDate) {
  //       // remove bookmark, and entry, and MOVE information to Selected!
  //       const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
  //       const releasedDecade = Math.floor(releasedYear / 10) * 10;
  //       await fuegoBookmarkDelete(user.uid, id, {
  //         releasedDecade,
  //         releasedYear,
  //         type,
  //         genre,
  //         addedDate,
  //       });
  //       dispatch({
  //         type: "info",
  //         payload: {
  //           artist,
  //           releasedDate,
  //           bookmark: false,
  //           genre,
  //           mediaId,
  //           poster,
  //           title,
  //           type,
  //           artistId,
  //         },
  //       });
  //     }
  //   } else {
  //     console.error("[EDIT]: Missing delete params");
  //   }
  // }

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
      // }
      dispatch({ type: "savedd" });
    } else {
      console.error("[SELECTED]: No user");
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
export default ContentSelected;
