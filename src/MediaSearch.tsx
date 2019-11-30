/**
 * MEDIA SEARCH
 * ---
 * We have a simple way of searching throughout three types of media. Using the API keys from each
 * respecitve service we can then get that
 *
 * Resources
 * - https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
 */
import * as React from "react";
import { useState, useEffect, createRef } from "react";
import { Box, Flex, Text } from "./components";
import Input, { InputRef } from "./components/Input";
import styled from "styled-components";
import useDebounce from "./hooks/useDebounce";
import { MediaTypes } from "./config/types";
import { useStoreActions } from "./config/store";
import { MediaSelected } from "./config/storeMedia";
// import { addMedia, addMediaLog } from "./config/actions";

const MediaResults = styled(Box)`
  max-height: 32vh;
  overflow: scroll;
  & > li:hover {
    cursor: pointer;
    color: var(--orange);
    background-color: var(--bg-secondary);
  }
`;

interface MediaSearchList extends MediaTypes {
  item: any;
  children(props: { name: string; artist: string; date: Date }): JSX.Element;
}

const MediaSearchList = (props: MediaSearchList) => {
  const { type, item } = props;
  let name;
  let artist;
  let date;

  if (type === "film") {
    name = item.title;
    artist = false;
    date = item.release_date;
  } else if (type === "tv") {
    name = item.original_name;
    artist = false;
    date = item.first_air_date;
  } else if (type === "album") {
    name = item.artistName;
    artist = item.collectionName;
    date = item.releaseDate;
  }

  return props.children({
    name: name,
    artist: artist,
    date: date
  });
};

const MediaSearch = ({ type }: MediaTypes) => {
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const [searchInput, setSearchInput] = useState("");
  const [mediaResult, setMediaResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const bouncedSearch = useDebounce(searchInput, 500);
  const InputRef = createRef<InputRef>();

  useEffect(() => {
    if (bouncedSearch) {
      setIsSearching(true);
      handleFetch(type, encodeURIComponent(bouncedSearch))
        .then((r: Response) => r.json())
        .then((res: any) => {
          setIsSearching(false);
          setMediaResult(res.results);
          // setMediaResult(
          //   type !== "album" ? res.results : res.results.albummatches.album
          // );
        });
    } else {
      setMediaResult([]);
    }
  }, [bouncedSearch, type]);

  useEffect(() => {
    if (InputRef.current) {
      InputRef.current.focus();
    }
  });

  return (
    <>
      <Box>
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Flex>
            <Text fontSize={4} fontWeight={600}>
              Media Search
            </Text>
            <Text as="span" fontSize={4} ml={2} fontWeight={300}>
              /
            </Text>
            <Text as="span" fontSize={4} ml={2} color="orange">
              {type}
            </Text>
          </Flex>
          <Text>Close</Text>
        </Flex>
        <Input
          ref={InputRef}
          onChange={e => setSearchInput(e.target.value)}
          placeholder={`Search ${type}`}
          type="search"
        />
      </Box>
      {isSearching && <Box pt={3}>Searching ...</Box>}
      {mediaResult.length > 0 && (
        <>
          <Box my={2} borderTop="1px solid #d1d5da" />
          <MediaResults
            as="ul"
            pt={2}
            pl={0}
            mb={0}
            style={{ listStyle: "none" }}
          >
            {mediaResult.map((e, i) => (
              <MediaSearchList key={type + i} type={type} item={e}>
                {({ name, artist, date }) => (
                  <Box
                    as="li"
                    py={2}
                    pl={2}
                    mt={0}
                    onClick={() => mediaSelect(mediaNormalize(e))}
                  >
                    {name && name}
                    {artist && ` - ${artist}`}
                    {date &&
                      ` (${new Date(date).toLocaleDateString("en-us", {
                        year: "numeric"
                      })})`}
                  </Box>
                )}
              </MediaSearchList>
            ))}
          </MediaResults>
        </>
      )}
    </>
  );

  // Will return promise with appropriate film information
  function handleFetch(searchType: MediaTypes["type"], search: string) {
    let URL = "";
    if (searchType === "film") {
      URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1&include_adult=false`;
    } else if (searchType === "tv") {
      URL = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1`;
    } else if (searchType === "album") {
      // URL = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${process.env.REACT_APP_LASTFM}&limit=15&format=json`;
      URL = `https://itunes.apple.com/search?term=${search}&entity=album`;
    }
    return fetch(URL);
  }

  function mediaNormalize(item: any) {
    let id, poster, title, published, overview, watched, artist, mbid;
    if (type === "film") {
      id = item.id.toString();
      poster = `https://image.tmdb.org/t/p/w400/${item.poster_path}`;
      title = item.title;
      published = item.release_date;
      overview = item.overview;
      artist = typeof item.director !== "undefined" && item.director;
      watched = "Watched";
    } else if (type === "tv") {
      id = item.id.toString();
      poster = `https://image.tmdb.org/t/p/w400/${item.poster_path}`;
      title = item.name;
      published = item.first_air_date;
      overview = item.overview;
      artist = typeof item.creator !== "undefined" && item.creator;
      watched = "Watched";
    } else if (type === "album") {
      id = encodeURIComponent(item.artistName + item.collectionName);
      poster = item.artworkUrl100.replace("100x100", "1000x1000");
      title = item.collectionName;
      artist = item.artistName;
      published = item.releaseDate;
      overview = "";
      watched = "Listened To";
    }
    const mediaReturn: MediaSelected = {
      id,
      poster,
      title,
      published,
      overview,
      watched,
      artist
    };
    return mediaReturn;
  }
};

export default MediaSearch;
