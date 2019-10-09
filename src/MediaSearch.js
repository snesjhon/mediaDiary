import React, { useState, useEffect } from "react";
import { db } from "./config/db";
import * as firebase from "firebase/app";
import useDebounce from "./hooks/useDebounce";
import { Box, Icon, Flex } from "./components";

const MediaSearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [movieResult, setMovieResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [type, setType] = useState("film");
  const bouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (bouncedSearch) {
      setIsSearching(true);
      let searchPromise;
      if (type === "film") {
        searchPromise = handleFilm(bouncedSearch);
      } else if (type === "tv") {
        searchPromise = handleTv(bouncedSearch);
      } else if (type === "album") {
        searchPromise = handleAlbum(bouncedSearch);
      }

      searchPromise
        .then(r => r.json())
        .then(res => {
          setIsSearching(false);
          setMovieResult(res.results);
        });
    } else {
      setMovieResult([]);
    }
  }, [bouncedSearch, type]);

  return (
    <>
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
        {movieResult.map((e, k) => {
          if (type === "film") {
            return filmResults(e, k);
          } else if (type === "tv") {
            return tvResults(e, k);
          } else if (type === "album") {
            return albumResults(e, k);
          }
        })}
      </Box>
    </>
  );
  function addMovie(movie) {
    const moviesByID = db.collection("media").doc("byID");
    const moviesByDate = db.collection("media").doc("byDate");

    db.runTransaction(transaction => {
      return transaction.get(moviesByID).then(movieCollection => {
        if (!movieCollection.exists) {
          transaction.set(moviesByID, {
            [`${type}_${movie.id.toString()}`]: movie
          });
        }
        transaction.update(moviesByID, {
          [`${type}_${movie.id.toString()}`]: movie
        });
      });
    });

    db.runTransaction(transaction => {
      return transaction.get(moviesByDate).then(movieDates => {
        if (!movieDates.exists) {
          return transaction.set(moviesByDate, {
            [new Date().toLocaleDateString().replace(/\//g, "-")]: {
              [`${type}_${movie.id.toString()}`]: {
                id: `${type}_${movie.id.toString()}`,
                rewatched: false,
                dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
                type: type
              }
            }
          });
        }
        let currentDate;
        const currentData = movieDates.data();
        if (currentData) {
          currentDate =
            currentData[new Date().toLocaleDateString().replace(/\//g, "-")];
        }

        transaction.update(moviesByDate, {
          [new Date().toLocaleDateString().replace(/\//g, "-")]: {
            ...currentDate,
            [`${type}_${movie.id.toString()}`]: {
              id: `${type}_${movie.id.toString()}`,
              rewatched: false,
              dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
              type: type
            }
          }
        });
      });
    });

    // Promise.all([addMovieDate, addMovieID]).then(e => console.log(e));
  }

  function handleFilm(search) {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.REACT_APP_MDB_KEY
      }&language=en-US&query=${encodeURIComponent(
        search
      )}&page=1&include_adult=false`
    );
  }

  function handleTv(search) {
    return fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${
        process.env.REACT_APP_MDB_KEY
      }&language=en-US&query=${encodeURIComponent(search)}&page=1`
    );
  }

  function handleAlbum(search) {
    return fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        search
      )}&media=music&entity=album`
    );
  }

  function filmResults(filmItem, key) {
    return (
      <div key={filmItem.title + key} onClick={() => addMovie(filmItem)}>
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
      <div key={tvItem.original_name + key} onClick={() => addMovie(tvItem)}>
        {tvItem.original_name} (
        {new Date(tvItem.first_air_date).toLocaleDateString("en-us", {
          year: "numeric"
        })}
        )
      </div>
    );
  }

  function albumResults(albumItem, key) {
    const { collectionName, artistName, releaseDate } = albumItem;
    return (
      <div key={collectionName + key} onClick={() => addMovie(albumItem)}>
        {artistName} - {collectionName} (
        {new Date(releaseDate).toLocaleDateString("en-us", {
          year: "numeric"
        })}
        )
      </div>
    );
  }
};

export default MediaSearch;
