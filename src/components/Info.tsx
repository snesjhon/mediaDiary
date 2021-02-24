import { Button, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";
import { useMDDispatch, useMDState } from "../config/store";
import type { MediaSelected } from "../config/types";
import type { MDbMovie, MDbTV } from "../config/typesMDb";
import type { SpotifyAlbum, SpotifyArtist } from "../config/typesSpotify";
import { parsePosterUrl } from "../utils/helpers";
import useDataFetch from "../utils/useDataFetch";
import InfoBody from "./info/InfoBody";
import InfoHeader from "./info/InfoHeader";
import MdLoader from "./md/MdLoader";

function Info(): JSX.Element {
  const { selected, view } = useMDState();

  if (selected && view === "info") {
    return <InfoSelected item={selected} />;
  }

  return <MdLoader />;
}

function InfoSelected({ item }: { item: MediaSelected }): JSX.Element {
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
        <InfoBody selected={parsedItem} />
      </DrawerBody>
      <DrawerFooter borderTopWidth="1px">
        <Button
          onClick={() =>
            dispatch({
              type: "log",
              payload: parsedItem,
            })
          }
          colorScheme="purple"
          variant="outline"
        >
          Add Memory
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

export default Info;
