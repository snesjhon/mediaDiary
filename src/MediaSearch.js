/**
 * MEDIA SEARCH
 * ---
 * We have a simple way of searching throughout three types of media. Using the API keys from each
 * respecitve service we can then get that
 */

import React, { useState, useEffect } from "react";
import { Box, Icon, Flex, Text } from "./components";
import { addMedia } from "./config/actions";
import useDebounce from "./hooks/useDebounce";

const MediaSearchList = props => {
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
    name = item.name;
    artist = item.artist;
    date = item.release_date;
  }

  return props.children({
    name: name,
    artist: artist,
    date: date
  });
};

const MediaSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [mediaResult, setMediaResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [type, setType] = useState("film");
  const bouncedSearch = useDebounce(searchInput, 500);

  // We can simply use a promise here because if we wanted to turn this into a
  // async func we'd have to create it outside of the current flow and then
  // maybe use useCallback(?) here. But I just want to do it inline.
  useEffect(() => {
    if (bouncedSearch) {
      setIsSearching(true);
      handleFetch(type, encodeURIComponent(bouncedSearch))
        .then(r => r.json())
        .then(res => {
          setIsSearching(false);
          setMediaResult(
            type !== "album" ? res.results : res.results.albummatches.album
          );
        });
    } else {
      setMediaResult([]);
    }
  }, [bouncedSearch, type]);

  return (
    <>
      <Box>
        <Flex alignItems="center">
          <Box mr={4}>
            <input
              onChange={e => setSearchInput(e.target.value)}
              placeholder={`Search ${type}`}
              type="search"
            />
          </Box>
          <Flex mr={3} alignItems="center">
            <input
              type="checkbox"
              checked={type === "film" ? true : false}
              onChange={() => setType("film")}
            />
            <Icon name="film" stroke="black" />
          </Flex>
          <Flex mr={3} alignItems="center">
            <input
              type="checkbox"
              checked={type === "tv" ? true : false}
              onChange={() => setType("tv")}
            />
            <Icon name="film" stroke="black" />
          </Flex>
          <Flex mr={3} alignItems="center">
            <input
              type="checkbox"
              checked={type === "album" ? true : false}
              onChange={() => setType("album")}
            />
            <Icon ml={2} name="film" stroke="black" />
          </Flex>
        </Flex>
      </Box>
      {isSearching && <Box pt={3}>Searching ...</Box>}
      {mediaResult.length > 0 && (
        <Box as="ul" pt={3} pl={0} mb={0} style={{ listStyle: "none" }}>
          {mediaResult.map((e, i) => (
            <MediaSearchList key={type + i} type={type} item={e}>
              {({ name, artist, date }) => (
                <li
                  // onClick={() => addMedia(e)}
                  onClick={() => console.log(e)}
                >
                  {name && name}
                  {artist && ` - ${artist}`}
                  {date &&
                    ` (${new Date(date).toLocaleDateString("en-us", {
                      year: "numeric"
                    })})`}
                </li>
              )}
            </MediaSearchList>
          ))}
        </Box>
      )}
    </>
  );

  // Will return promise with appropriate film information
  function handleFetch(searchType, search) {
    let URL;
    if (searchType === "film") {
      URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1&include_adult=false`;
    } else if (searchType === "tv") {
      URL = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1`;
    } else if (searchType === "album") {
      URL = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${process.env.REACT_APP_LASTFM}&limit=15&format=json`;
    }
    return fetch(URL);
  }

  async function handleAlbumInfo(artist, name, mbid) {
    const r = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
        process.env.REACT_APP_LASTFM
      }${
        mbid !== "" ? `&mbid=${mbid}` : `&artist=${artist}&album=${name}`
      }&format=json`
    );
    const albumInfo = await r.json();
    // after handling the information we can then get the info into the viewer.
    console.log(albumInfo);
  }
};

export default MediaSearch;

// function handleTv(itemType, search) {
//   return fetch(
//     itemType === "film"
//       ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1&include_adult=false`
//       : `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1`
//   );
//   // let URL;
//   // if (type === "film") {
//   //   URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1&include_adult=false`;
//   // } else if (type === "tv") {
//   //   URL = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1`;
//   // } else if (type === "album") {
//   //   URL = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${process.env.REACT_APP_LASTFM}&limit=15&format=json`;
//   // }
//   // return fetch(URL);
// }
// <MediaSearchList
// type={type}

// >
//   {() => {
//     <div
//       key={tvItem.original_name + key}
//       onClick={() => addMedia(tvItem)}
//     >
//       {tvItem.original_name} (
//       {new Date(tvItem.first_air_date).toLocaleDateString("en-us", {
//         year: "numeric"
//       })}
//       )
//     </div>;
//   }}
// </MediaSearchList>
// {/* {mediaResult.map((e, k) => {
//   if (type === "film") {
//     return filmResults(e, k);
//   } else if (type === "tv") {
//     return tvResults(e, k);
//   } else if (type === "album") {
//     return albumResults(e, k);
//   }
// })} */}

// function filmResults(filmItem, key) {
//   return (
//     <div key={filmItem.title + key} onClick={() => addMedia(filmItem)}>
//       {filmItem.title} (
//       {new Date(filmItem.release_date).toLocaleDateString("en-us", {
//         year: "numeric"
//       })}
//       )
//     </div>
//   );
// }

// function tvResults(tvItem, key) {
//   return (
// <div key={tvItem.original_name + key} onClick={() => addMedia(tvItem)}>
//   {tvItem.original_name} (
//   {new Date(tvItem.first_air_date).toLocaleDateString("en-us", {
//     year: "numeric"
//   })}
//   )
// </div>
//   );
// }

// function albumResults(albumItem, key) {
//   const { artist, name, mbid } = albumItem;
//   return (
//     <div key={name + key} onClick={() => handleAlbumInfo(artist, name, mbid)}>
//       {artist} - {name}
//     </div>
//   );
// }

// function mediaResultItem(mediaType, mediaItem, key) {
//   // we can prob create a consice way of what we need from each block instead of trying
//   // to create a new block for each. Let's just have a single component into a single item.
//   const mediaObj = {};
//   return (
//     <div key={mediaItem.title + key} onClick={() => addMedia(mediaItem)}>
//       {mediaItem.title} (
//       {new Date(mediaItem.release_date).toLocaleDateString("en-us", {
//         year: "numeric"
//       })}
//       )
//     </div>
//   );
//     }
