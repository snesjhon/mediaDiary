/**
 * MEDIA SEARCH
 * ---
 * We have a simple way of searching throughout three types of media. Using the API keys from each
 * respecitve service we can then get that
 */

import React, { useState, useEffect, createRef } from "react";
import { Box, Icon, Flex, Text, Checkbox, Input } from "./components";
import styled from "styled-components";
import { addMedia, addMediaLog } from "./config/actions";
import useDebounce from "./hooks/useDebounce";

const MediaResults = styled(Box)`
  max-height: 32vh;
  overflow: scroll;
  & > li:hover {
    cursor: pointer;
    color: var(--orange);
    background-color: var(--bg-secondary);
  }
`;

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

const MediaSearch = props => {
  const { setSelected, type } = props;
  const [searchInput, setSearchInput] = useState("");
  const [mediaResult, setMediaResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const bouncedSearch = useDebounce(searchInput, 500);
  const InputRef = createRef();

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
            <Text fontSize={4} fontWeight="600">
              Media Search
            </Text>
            <Text as="span" fontSize={4} ml={2} fontWeight="300">
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
                    onClick={() => setSelected(e)}
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

// <Flex>
//           <Flex alignItems="baseline" ml={4}>
//             <Icon
//               mr={2}
//               cursor="pointer"
//               height="20px"
//               width="20px"
//               stroke="var(--primary)"
//               name={type === "film" ? "checked" : "unchecked"}
//               onClick={() => setType("film")}
//             />
//             <Icon
//               name="film"
//               stroke="var(--secondary)"
//               height="25px"
//               width="25px"
//             />
//           </Flex>
//           <Flex alignItems="baseline" ml={4}>
//             <Icon
//               mr={2}
//               cursor="pointer"
//               height="20px"
//               width="20px"
//               stroke="var(--primary)"
//               name={type === "tv" ? "checked" : "unchecked"}
//               onClick={() => setType("tv")}
//             />
// <Icon
//   name="tv"
//   stroke="var(--secondary)"
//   height="25px"
//   width="25px"
// />
//           </Flex>
//           <Flex alignItems="baseline" ml={4}>
//             <Icon
//               mr={2}
//               cursor="pointer"
//               height="20px"
//               width="20px"
//               stroke="var(--primary)"
//               name={type === "album" ? "checked" : "unchecked"}
//               onClick={() => setType("album")}
//             />
//             <Icon
//               name="album"
//               stroke="var(--secondary)"
//               height="25px"
//               width="25px"
//             />
//           </Flex>
//         </Flex>
