import type { MediaSelected, MediaType } from "@/types";
import { parsePosterUrl } from "@/utils";
import dayjs from "dayjs";
import type {
  MDbSearchResult,
  SearchTypes,
  SpotifySearchResult,
} from "../../types";
import React, { useState } from "react";
import { AddResultList } from "..";
import { FilmIcon, TvIcon, AlbumIcon } from "@/icons";

interface Props {
  data: SearchTypes;
  showAlbum: boolean;
  showMovie: boolean;
  showTV: boolean;
}

export default function AddResults({
  data,
  showAlbum,
  showMovie,
  showTV,
}: Props): JSX.Element {
  const [currMovie, setCurrMovie] = useState(5);
  const [currTv, setCurrTv] = useState(5);
  const [currAlbum, setCurrAlbum] = useState(5);
  const mdbData = data[0];
  const spotifyData = data[1];

  let albumData;
  if (showAlbum && spotifyData) {
    albumData = spotifyData.albums.items.map((e) => mediaNormalize(e));
  }

  let tvData;
  let movieData;
  if (mdbData && (showMovie || showTV)) {
    const filteredData: MediaSelected[] = mdbData.results
      .map((e) => mediaNormalize(e))
      // person could also be part of the result, from mdbData
      .filter((e) => (e.type as MediaType & "person") !== "person");

    const { movieOutput, tvOutput } = filteredData.reduce<{
      movieOutput: MediaSelected[];
      tvOutput: MediaSelected[];
    }>(
      (a, c: MediaSelected) => {
        if (c.type === "movie") {
          a["movieOutput"].push(c);
        } else if (c.type === "tv") {
          a["tvOutput"].push(c);
        }
        return a;
      },
      { movieOutput: [], tvOutput: [] }
    );
    if (showMovie) {
      movieData = movieOutput;
    }
    if (showTV) {
      tvData = tvOutput;
    }
  }

  return (
    <>
      {showMovie && movieData && (
        <AddResultList
          data={movieData}
          title="Movie"
          DataIcon={FilmIcon}
          seeNumber={currMovie}
          seeAction={setCurrMovie}
        />
      )}
      {showTV && tvData && (
        <AddResultList
          data={tvData}
          title="TV"
          DataIcon={TvIcon}
          seeNumber={currTv}
          seeAction={setCurrTv}
        />
      )}
      {showAlbum && albumData && (
        <AddResultList
          data={albumData}
          title="Album"
          DataIcon={AlbumIcon}
          seeNumber={currAlbum}
          seeAction={setCurrAlbum}
        />
      )}
    </>
  );

  function mediaNormalize(
    item: SpotifySearchResult | MDbSearchResult
  ): MediaSelected {
    const type =
      typeof (item as MDbSearchResult)?.media_type !== "undefined"
        ? (item as MDbSearchResult).media_type
        : "album";

    if (type === "album") {
      // TODO: This is probably not the best solution, but I haven't figured out TS method yet.
      const castItem = item as SpotifySearchResult;
      return {
        mediaId: castItem.id,
        poster: parsePosterUrl(castItem.images[0].url, type),
        title: castItem.name,
        releasedDate: dayjs(castItem.release_date).toISOString(),
        artist: castItem.artists[0].name,
        artistId: castItem.artists[0].id,
        bookmark: false,
        memory: false,
        diary: false,
        genre: "",
        type,
      };
    } else {
      let released;
      const castItem = item as MDbSearchResult;
      try {
        released = dayjs(
          type === "movie" ? castItem.release_date : castItem.first_air_date
        ).toISOString();
      } catch {
        released =
          type === "movie" ? castItem.release_date : castItem.first_air_date;
      }
      return {
        mediaId: castItem.id.toString(),
        poster: castItem.poster_path
          ? parsePosterUrl(castItem.poster_path, type as MediaType)
          : "",
        title:
          type === "movie"
            ? castItem.title ?? ""
            : castItem.original_name ?? "",
        releasedDate: released ?? "",
        genre: "",
        artist: "",
        bookmark: false,
        memory: false,
        diary: false,
        type: type as MediaType,
      };
    }
  }
}
