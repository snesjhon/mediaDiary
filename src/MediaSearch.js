import React, { useState, useEffect } from "react";
import { Box, Icon, Flex } from "./components";
import { addMedia } from "./config/actions";
import useDebounce from "./hooks/useDebounce";

const MediaSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [mediaResult, setMediaResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [type, setType] = useState("film");
  const bouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (bouncedSearch) {
      setIsSearching(true);
      let searchPromise;
      const encodedSearch = encodeURIComponent(bouncedSearch);
      if (type === "film") {
        searchPromise = handleFilm(encodedSearch);
      } else if (type === "tv") {
        searchPromise = handleTv(encodedSearch);
      } else if (type === "album") {
        searchPromise = handleAlbum(encodedSearch);
      }

      searchPromise
        .then(r => r.json())
        .then(res => {
          setIsSearching(false);
          if (type !== "album") {
            setMediaResult(res.results);
          } else {
            console.log(res);
            setMediaResult(res.results.albummatches.album);
          }
        });
    } else {
      setMediaResult([]);
    }
  }, [bouncedSearch, type]);

  return (
    <Box p={2} width={[1 / 2]}>
      <Flex>
        <Box mr={3}>
          <Icon name="film" stroke="black" />
          <input
            type="checkbox"
            checked={type === "film" ? true : false}
            onChange={() => setType("film")}
          />
          Film
        </Box>
        <Box mr={3}>
          <Icon name="film" stroke="black" />
          <input
            type="checkbox"
            checked={type === "tv" ? true : false}
            onChange={() => setType("tv")}
          />
          TV Show
        </Box>
        <Box mr={3}>
          <Icon name="film" stroke="black" />
          <input
            type="checkbox"
            checked={type === "album" ? true : false}
            onChange={() => setType("album")}
          />
          Music
        </Box>
      </Flex>
      <input
        onChange={e => setSearchInput(e.target.value)}
        placeholder={`Search {type} Comics`}
        type="search"
      />
      {isSearching && <div>Searching ...</div>}
      {mediaResult.map((e, k) => {
        if (type === "film") {
          return filmResults(e, k);
        } else if (type === "tv") {
          return tvResults(e, k);
        } else if (type === "album") {
          return albumResults(e, k);
        }
      })}
    </Box>
  );

  function handleFilm(search) {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1&include_adult=false`
    );
  }

  function handleTv(search) {
    return fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_MDB}&language=en-US&query=${search}&page=1`
    );
  }

  function handleAlbum(search) {
    return fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${process.env.REACT_APP_LASTFM}&limit=15&format=json`
    );
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
    // addMedia(albumInfo)
    console.log(albumInfo);
  }

  function filmResults(filmItem, key) {
    return (
      <div key={filmItem.title + key} onClick={() => addMedia(filmItem)}>
        {filmItem.title} (
        {new Date(filmItem.release_date).toLocaleDateString("en-us", {
          year: "numeric"
        })}
        )
      </div>
    );
  }

  function tvResults(tvItem, key) {
    return (
      <div key={tvItem.original_name + key} onClick={() => addMedia(tvItem)}>
        {tvItem.original_name} (
        {new Date(tvItem.first_air_date).toLocaleDateString("en-us", {
          year: "numeric"
        })}
        )
      </div>
    );
  }

  function albumResults(albumItem, key) {
    const { artist, name, mbid } = albumItem;
    return (
      <div key={name + key} onClick={() => handleAlbumInfo(artist, name, mbid)}>
        {artist} - {name}
      </div>
    );
  }
};

export default MediaSearch;
