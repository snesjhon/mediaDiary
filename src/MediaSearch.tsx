/**
 * MEDIA SEARCH
 * ---
 * We have a simple way of searching throughout three types of media. Using the API keys from each
 * respecitve service we can then get that
 *
 * Resources
 * - https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
 */
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import * as React from "react";
import { useEffect, useReducer, useRef } from "react";
import { MBDKEY } from "./config/constants";
import { useStoreActions } from "./config/store";
import { MediaSelected, MediaTyper, MediaTypes } from "./config/storeMedia";
import useDebounce from "./hooks/useDebounce";
import { IconFilm, IconMusic, IconSearch, IconTV, IconX } from "./icons";

interface MediaSearchListProps extends MediaTypes {
  item: any;
  children(props: { name: string; artist: string; date: Date }): JSX.Element;
}

const MediaSearchList = ({ type, item, children }: MediaSearchListProps) => {
  let name;
  let artist;
  let date;

  if (type === "film") {
    name = item.title;
    artist = "";
    date = item.release_date;
  } else if (type === "tv") {
    name = item.original_name;
    artist = "";
    date = item.first_air_date;
  } else if (type === "album") {
    name = item.artistName;
    artist = item.collectionName;
    date = item.releaseDate;
  }

  return children({
    name: name,
    artist: artist,
    date: date
  });
};

type StateType = {
  expanded: boolean;
  searchInput: string;
  mediaResult: Array<string>;
  isSearching: boolean;
  type: MediaTyper;
};

type ActionType = {
  type: "hasResults" | "isSearching" | "noResults" | "searchInput" | "setType";
  payload?: any;
};

const MediaAddReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "hasResults": {
      return {
        ...state,
        isSearching: false,
        expanded: true,
        mediaResult: action.payload
      };
    }
    case "isSearching": {
      return {
        ...state,
        isSearching: true
      };
    }
    case "searchInput": {
      return {
        ...state,
        searchInput: action.payload
      };
    }
    case "noResults": {
      return {
        ...state,
        isSearching: false,
        expanded: false
      };
    }
    case "setType": {
      return {
        ...state,
        type: action.payload
      };
    }
    default:
      return state;
  }
};

const useStyles = makeStyles(theme => ({
  card: {
    width: theme.breakpoints.values.sm
  },
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh"
  }
}));

interface MediaLogProps {
  setViewType: React.Dispatch<React.SetStateAction<string>>;
  dialogClose: () => void;
}

function MediaSearch({ dialogClose, setViewType }: MediaLogProps) {
  const InputRef = useRef<HTMLInputElement>(null);
  const classes = useStyles();
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const [
    { expanded, searchInput, mediaResult, isSearching, type },
    dispatch
  ] = useReducer(MediaAddReducer, {
    expanded: false,
    searchInput: "",
    mediaResult: [],
    isSearching: false,
    type: "film"
  });

  const bouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    if (bouncedSearch) {
      handleFetch(type, encodeURIComponent(bouncedSearch))
        .then((r: Response) => r.json())
        .then((res: any) => {
          if (res.results.length === 0) {
            dispatch({ type: "noResults" });
          } else {
            dispatch({ type: "hasResults", payload: res.results });
          }
        });
    } else {
      dispatch({ type: "noResults" });
    }
  }, [bouncedSearch, type]);

  useEffect(() => {
    if (InputRef.current) {
      InputRef.current.focus();
    }
  }, [type]);

  return (
    <>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h5" component="h1">
              Media Search
            </Typography>
            <Box ml={2} mr={1}>
              <Typography variant="h5">/</Typography>
            </Box>
            <IconButton
              onClick={() => dispatch({ type: "setType", payload: "film" })}
              color={type === "film" ? "primary" : undefined}
            >
              <IconFilm />
            </IconButton>
            <IconButton
              onClick={() => dispatch({ type: "setType", payload: "tv" })}
              color={type === "tv" ? "primary" : undefined}
            >
              <IconTV />
            </IconButton>
            <IconButton
              onClick={() => dispatch({ type: "setType", payload: "album" })}
              color={type === "album" ? "primary" : undefined}
            >
              <IconMusic />
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={dialogClose}>
              <IconX />
            </IconButton>
          </Box>
        </Box>
        <Box my={2} />
        <TextField
          inputRef={InputRef}
          fullWidth
          autoFocus
          variant="outlined"
          id="input-with-icon-textfield"
          label={`Search for ${type}`}
          onChange={e =>
            dispatch({ type: "searchInput", payload: e.target.value })
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            )
          }}
        />
        <Collapse in={expanded} timeout="auto">
          <Box className={classes.mediaResults}>
            <Table>
              <TableBody>
                {mediaResult.map((e: any, i: number) => (
                  <MediaSearchList key={type + i} type={type} item={e}>
                    {({ name, artist, date }) => (
                      <TableRow hover onClick={() => handleSelect(e)}>
                        <TableCell>
                          {isSearching ? (
                            <Skeleton animation="wave" />
                          ) : name && artist !== "" ? (
                            `${name} - ${artist}`
                          ) : (
                            name
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {date &&
                            ` (${new Date(date).toLocaleDateString("en-us", {
                              year: "numeric"
                            })})`}
                        </TableCell>
                      </TableRow>
                    )}
                  </MediaSearchList>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </CardContent>
    </>
  );

  function handleSelect(e: any) {
    mediaSelect(mediaNormalize(e));
    return setViewType("log");
  }

  // Will return promise with appropriate film information
  function handleFetch(searchType: string, search: string) {
    let URL = "";
    if (searchType === "film") {
      URL = `https://api.themoviedb.org/3/search/movie?api_key=${MBDKEY}&language=en-US&query=${search}&page=1&include_adult=false`;
    } else if (searchType === "tv") {
      URL = `https://api.themoviedb.org/3/search/tv?api_key=${MBDKEY}&language=en-US&query=${search}&page=1`;
    } else if (searchType === "album") {
      // URL = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${search}&api_key=${MBDKEY}&limit=15&format=json`;
      URL = `https://itunes.apple.com/search?term=${search}&entity=album`;
    }
    return fetch(URL);
  }

  function mediaNormalize(item: any) {
    let id, poster, title, published, overview, watched, artist;
    if (type === "film") {
      id = item.id.toString();
      poster = item.poster_path;
      title = item.title;
      published = item.release_date;
      overview = item.overview;
      artist = typeof item.director !== "undefined" && item.director;
      watched = "Watched";
    } else if (type === "tv") {
      id = item.id.toString();
      poster = item.poster_path;
      title = item.name;
      published = item.first_air_date;
      overview = item.overview;
      artist = typeof item.creator !== "undefined" && item.creator;
      watched = "Watched";
    } else if (type === "album") {
      id = encodeURIComponent(item.artistName + item.collectionName);
      poster = item.artworkUrl100;
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
      artist,
      type
    };
    return mediaReturn;
  }
}

export default MediaSearch;
