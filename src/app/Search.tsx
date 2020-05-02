/**
 * MEDIA SEARCH
 * ---
 * We have a simple way of searching throughout three types of media. Using the API keys from each
 * respecitve service we can then get that
 *
 * Resources
 * - https://medium.com/@martin_hotell/react-refs-with-typescript-a32d56c4d315
 */
import { InputBase, Toolbar, AppBar } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import * as React from "react";
import {
  useEffect,
  useReducer,
  useRef,
  Dispatch,
  useCallback,
  useContext,
} from "react";
import { MBDKEY } from "../config/constants";
import { useStoreActions } from "../store/store";
import { MediaSelected } from "../store/storeMedia";
import useDebounce from "../util/useDebounce";
import { IconFilm, IconMenu, IconMusic, IconTV } from "../icons";
import { MediaTypes } from "./Media";
import { MDDispatchCtx } from "./MediaDiary";

interface SearchState {
  expanded: boolean;
  searchInput: string;
  mediaResult: Array<string>;
  isSearching: boolean;
  type: MediaTypes;
}

interface SearchActions {
  type: "hasResults" | "isSearching" | "noResults" | "searchInput" | "setType";
  payload?: any;
}

const MediaAddReducer = (state: SearchState, actions: SearchActions) => {
  switch (actions.type) {
    case "hasResults": {
      return {
        ...state,
        isSearching: false,
        expanded: true,
        mediaResult: actions.payload,
      };
    }
    case "isSearching": {
      return {
        ...state,
        isSearching: true,
      };
    }
    case "searchInput": {
      return {
        ...state,
        searchInput: actions.payload,
      };
    }
    case "noResults": {
      return {
        ...state,
        isSearching: false,
        expanded: false,
      };
    }
    case "setType": {
      return {
        ...state,
        type: actions.payload,
      };
    }
    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  nav: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 9,
  },
  appbar: {
    backgroundColor: "#F0F0F0",
  },
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh",
    zIndex: theme.zIndex.drawer,
  },
  mediaSearchInput: {
    padding: 0,
  },
  searchBar: {
    paddingLeft: theme.spacing(2),
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  toolbarPad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  collapse: {
    position: "absolute",
    top: theme.spacing(5),
    width: "100%",
    backgroundColor: "white",
  },
  backDrop: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    // zIndex: (props) => (props ? 2 : -1),
    zIndex: 2,
    position: "fixed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000080",
    opacity: 1,
    // opacity: (props) => (props ? 1 : 0),
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
}));

function Search({
  setShowSearch,
}: {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const InputRef = useRef<HTMLInputElement>(null);
  // const mediaSelect = useStoreActions((actions) => actions.media.mediaSelect);
  const [
    { expanded, searchInput, mediaResult, isSearching, type },
    dispatch,
  ] = useReducer(MediaAddReducer, {
    expanded: false,
    searchInput: "",
    mediaResult: [],
    isSearching: false,
    type: "film",
  });

  const classes = useStyles(expanded);
  const bouncedSearch = useDebounce(searchInput, 500);
  const mediaDispatch = useContext(MDDispatchCtx);

  // mediaSelect(obj).then(
  //   () => console.log("lkjlkj")
  //   // dispatchMedia({ type: "toggleLog", payload: true })
  // ),
  // const logMedia = useCallback(
  //   (obj) =>
  //     mediaSelect({
  //       mediaSelected: obj,
  //       cb: () => dispatchMedia({ type: "toggleLog", payload: true }),
  //     }),
  //   [mediaSelect, dispatchMedia]
  // );

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
      <Box className={classes.nav}>
        <AppBar className={classes.appbar} position="sticky" variant="outlined">
          <Toolbar
            className={classes.toolbarPad}
            variant="dense"
            disableGutters={true}
          >
            <IconButton disableFocusRipple={true} size="small">
              <IconMenu />
            </IconButton>
            <Box className={classes.searchBar}>
              <InputBase
                inputRef={InputRef}
                type="search"
                autoFocus={true}
                placeholder="Add Movie"
                classes={{
                  input: classes.mediaSearchInput,
                }}
                onChange={(e) =>
                  dispatch({ type: "searchInput", payload: e.target.value })
                }
              />
            </Box>
            <IconButton
              size="small"
              onClick={() => dispatch({ type: "setType", payload: "film" })}
              color={type === "film" ? "primary" : undefined}
            >
              <IconFilm />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => dispatch({ type: "setType", payload: "tv" })}
              color={type === "tv" ? "primary" : undefined}
            >
              <IconTV />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => dispatch({ type: "setType", payload: "album" })}
              color={type === "album" ? "primary" : undefined}
            >
              <IconMusic />
            </IconButton>
          </Toolbar>
          <Collapse className={classes.collapse} in={expanded} timeout="auto">
            <Box className={classes.mediaResults}>
              <Table>
                <TableBody>
                  {mediaResult.map((e: any, i: number) => (
                    <MediaSearchList key={type + i} type={type} item={e}>
                      {({ name, artist, date }) => (
                        // <TableRow hover onClick={() => handleSelect(e)}>
                        <TableRow
                          hover
                          onClick={() =>
                            mediaDispatch({
                              type: "select",
                              payload: {
                                view: "diary",
                                selected: mediaNormalize(e),
                              },
                            })
                          }
                        >
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
                                year: "numeric",
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
        </AppBar>
      </Box>
      <Box className={classes.backDrop} onClick={() => setShowSearch(false)} />
    </>
  );

  // function handleSelect(e: any) {
  //   return logMedia(mediaNormalize(e));
  //   // return dispatchMedia({ type: "toggleLog", payload: true });
  // }

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
    let id, poster, title, published, overview, watched, artist, backdrop;
    if (type === "film") {
      id = item.id.toString();
      poster = item.poster_path;
      backdrop = item.backdrop_path;
      title = item.title;
      published = item.release_date;
      overview = item.overview;
      artist = typeof item.director !== "undefined" && item.director;
      watched = "Watched";
    } else if (type === "tv") {
      id = item.id.toString();
      poster = item.poster_path;
      backdrop = item.poster_path;
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
      type,
      backdrop,
    };
    return mediaReturn;
  }
}

interface MediaSearchListProps {
  item: any;
  children(props: { name: string; artist: string; date: Date }): JSX.Element;
  type: MediaTypes;
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
    date: date,
  });
};

export default Search;
