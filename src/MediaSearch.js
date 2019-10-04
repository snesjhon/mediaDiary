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
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          process.env.REACT_APP_MDB_KEY
        }&language=en-US&query=${encodeURIComponent(
          bouncedSearch
        )}&page=1&include_adult=false`
      )
        .then(r => r.json())
        .then(res => {
          setIsSearching(false);
          setMovieResult(res.results);
        });
    } else {
      setMovieResult([]);
    }
  }, [bouncedSearch]);

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
              checked={type === "music" ? true : false}
              onChange={() => setType("music")}
            />
            Music
          </Box>
        </Flex>
        <input
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search Marvel Comics"
          type="search"
          style={{ border: "none" }}
        />
        {isSearching && <div>Searching ...</div>}
        {movieResult.map((e, k) => (
          <div key={e.title + k} onClick={() => addMovie(e)}>
            {e.title} (
            {new Date(e.release_date).toLocaleDateString("en-us", {
              year: "numeric"
            })}
            )
          </div>
        ))}
      </Box>
    </>
  );
  function addMovie(movie) {
    const moviesByID = db.collection("movies").doc("byID");
    const moviesByDate = db.collection("movies").doc("byDate");

    const addMovieID = db.runTransaction(transaction => {
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
    const addMovieDate = db.runTransaction(transaction => {
      return transaction.get(moviesByDate).then(movieDates => {
        if (!movieDates.exists) {
          return transaction.set(moviesByDate, {
            [new Date().toLocaleDateString().replace(/\//g, "-")]: {
              [`${type}_${movie.id.toString()}`]: {
                rewatched: false,
                dateAdded: firebase.firestore.FieldValue.serverTimestamp()
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
              rewatched: false,
              dateAdded: firebase.firestore.FieldValue.serverTimestamp()
            }
          }
        });
      });
    });

    Promise.all([addMovieDate, addMovieID]).then(e => console.log(e));
  }
};

export default MediaSearch;
