import DayjsUtils from "@date-io/dayjs";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating/Rating";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  DatePicker,
} from "@material-ui/pickers";
import * as React from "react";
import { useEffect, useReducer } from "react";
import { MBDKEY, MDBURL } from "./config/constants";
import { useStoreActions, useStoreState } from "./config/store";
import { IconChevronLeft, IconRepeat, IconStar } from "./icons";
import MediaCardInfo from "./MediaCardInfo";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createPosterURL } from "./utilities/helpers";

type MediaLogState = {
  date: Date;
  seen: boolean;
  star: number;
  localArtist: string;
  localPoster: string;
  loading: boolean;
  season: any;
  episode: number;
  seasons?: any;
};

type MediaLogAction = {
  type: "setData" | "setFetchData" | "setSeasons" | "setSeason";
  key?: string;
  payload?: any;
};

const MediaLogReducer = (state: MediaLogState, action: MediaLogAction) => {
  let actionKey = action.key;
  if (typeof actionKey === "undefined") {
    actionKey = "";
  }
  switch (action.type) {
    case "setData": {
      return {
        ...state,
        [actionKey]: action.payload,
      };
    }
    case "setFetchData": {
      return {
        ...state,
        loading: false,
        [actionKey]: action.payload,
      };
    }
    case "setSeasons": {
      return {
        ...state,
        loading: false,
        localArtist: action.payload.localArtist,
        localPoster: action.payload.localPoster,
        season: action.payload.season,
        seasons: action.payload.seasons,
      };
    }
    case "setSeason": {
      return {
        ...state,
        season: action.payload.season,
        episode: 1,
        localPoster: action.payload.localPoster,
      };
    }
    default:
      return state;
  }
};

const MediaLog = () => {
  // const classes = useStyles();
  const mediaSelect = useStoreActions((actions) => actions.media.mediaSelect);
  const mediaPutFilm = useStoreActions((actions) => actions.media.mediaPutFilm);
  const mediaPutTV = useStoreActions((actions) => actions.media.mediaPutTV);
  const mediaPutAlbum = useStoreActions(
    (actions) => actions.media.mediaPutAlbum
  );
  const {
    id,
    artist,
    overview,
    poster,
    backdrop,
    published,
    title,
    type,
  } = useStoreState((state) => state.media.mediaSelected);

  const [
    {
      date,
      seen,
      star,
      localArtist,
      season,
      episode,
      seasons,
      localPoster,
      loading,
    },
    dispatch,
  ] = useReducer(MediaLogReducer, {
    date: new Date(),
    seen: false,
    star: 0,
    season: {},
    episode: 1,
    seasons: {},
    localArtist: artist,
    localPoster: poster,
    loading: type === "tv" ? true : false,
  });

  useEffect(() => {
    if (type === "tv") {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${MBDKEY}&language=en-US`
      )
        .then((r) => r.json())
        .then((info) =>
          dispatch({
            type: "setSeasons",
            payload: {
              localArtist:
                info.created_by.length > 0 &&
                info.created_by.map((e: any) => e.name).join(", "),
              season: info.seasons[0],
              seasons: info.seasons,
              localPoster: info.seasons[0].poster_path,
            },
          })
        );
    } else if (type === "film") {
      fetch(
        `${MDBURL}/movie/${encodeURIComponent(id)}/credits?api_key=${MBDKEY}`
      )
        .then((r) => r.json())
        .then((credits) => {
          return dispatch({
            type: "setFetchData",
            key: "localArtist",
            payload: credits.crew.find((e: any) => e.job === "Director").name,
          });
        });
    }
  }, [type, id]);

  if (loading) {
    return <div>loading</div>;
  } else {
    let posterBackdrop;
    const poster = createPosterURL({ type, poster: localPoster });
    if (typeof backdrop !== "undefined") {
      posterBackdrop = createPosterURL({ type, poster: backdrop });
    }
    return (
      <>
        <MediaCardInfo
          id={id}
          title={title}
          published={published}
          artist={localArtist}
          dialogClose={() => {}}
          poster={poster}
          backdrop={typeof posterBackdrop !== "undefined" ? posterBackdrop : ""}
        />
        <Box mx={4}>
          {Object.keys(season).length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Season</Typography>
                <Select
                  labelId="mediaSeason"
                  disableUnderline={true}
                  value={season.season_number}
                  onChange={(e: any) => {
                    return dispatch({
                      type: "setSeason",
                      payload: {
                        season: seasons[e.target.value],
                        localPoster: seasons[e.target.value].poster_path,
                      },
                    });
                  }}
                >
                  {seasons.map((seasonInfo: any) => (
                    <MenuItem
                      key={seasonInfo.season_number}
                      value={seasonInfo.season_number}
                    >
                      Season {seasonInfo.season_number}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box py={2}>
                <Divider />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Episode</Typography>
                <Select
                  labelId="mediaEpisode"
                  value={episode}
                  disableUnderline={true}
                  onChange={(e: any) =>
                    dispatch({
                      type: "setData",
                      key: "episode",
                      payload: e.target.value,
                    })
                  }
                >
                  {Array.from(
                    { length: season.episode_count },
                    (_, episodeNumber: number) => (
                      <MenuItem
                        key={episodeNumber + 1}
                        value={episodeNumber + 1}
                      >
                        Episode {episodeNumber + 1}
                      </MenuItem>
                    )
                  )}
                </Select>
              </Box>
              <Box py={2}>
                <Divider />
              </Box>
            </>
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Date</Typography>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <DatePicker
                disableToolbar
                disableFuture
                variant="inline"
                format="MM/DD/YYYY"
                value={date}
                autoOk={true}
                onChange={(e) =>
                  e !== null
                    ? dispatch({
                        type: "setData",
                        key: "date",
                        payload: e.toDate(),
                      })
                    : null
                }
                InputProps={{
                  disableUnderline: true,
                }}
                inputProps={{
                  style: { textAlign: "right", cursor: "pointer" },
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">Rate</Typography>
            <Rating
              value={star}
              name="rated"
              precision={0.5}
              onChange={(_, newValue: number) =>
                dispatch({
                  type: "setData",
                  key: "star",
                  payload: newValue,
                })
              }
              emptyIcon={<IconStar empty fill="#03b021" />}
              icon={<IconStar fill="#03b021" stroke="#03b021" />}
            />
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Seen Before?</Typography>
            <IconButton
              size="small"
              onClick={() =>
                dispatch({
                  type: "setData",
                  key: "seen",
                  payload: !seen,
                })
              }
            >
              <IconRepeat stroke={seen ? "blue" : undefined} />
            </IconButton>
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
          <Box display="flex" justifyContent="flex-end" py={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={mediaSet}
              disableElevation
            >
              <Typography variant="body2">Save</Typography>
            </Button>
          </Box>
        </Box>
      </>
    );
  }

  function mediaSet() {
    const mediaObj = {
      type,
      id,
      overview,
      poster,
      published,
      title,
      seen,
      star,
      date,
      artist: localArtist,
    };
    if (type === "film") {
      mediaPutFilm(mediaObj);
    } else if (type === "tv") {
      const tvObj = {
        ...mediaObj,
        id: season.id,
        title: title,
        artist: localArtist,
        season: season.season_number,
        episode: episode,
        overview: season.overview,
        published: season.air_date,
        poster: localPoster,
      };

      mediaPutTV(tvObj);
    } else {
      mediaPutAlbum(mediaObj);
    }
  }
};

export default MediaLog;

// case "setSeen":
//   return {
//     ...state,
//     seen: action.payload
//   };
// case "setStar":
//   return {
//     ...state,
//     star: action.payload
//   };
// case "setInfo":
//   return {
//     ...state,
//     info: action.payload
//   };
// case "setLoading":
//   return {
//     ...state,
//     loading: action.payload
//   };
// case "setArtist":
//   return {
//     ...state,
//     artist: action.payload
//   };

// const [date, setDate] = useState(new Date());
// const [seen, setSeen] = useState(false);
// const [star, setStar] = useState(0);
// const [info, setInfo] = useState();
// const [localArtist, setLocalArtist] = useState(artist);
// const [seasonInfo, setSeasonInfo] = useState();
// const [loading, setLoading] = useState(type === "tv" ? true : false);

// if we don't have an artist, get it from the info
// if (!localArtist && info.created_by.length > 0) {
//   dispatch({
//     type: "setData",
//     key: "localArtist",
//     payload: info.created_by[0].name
//   });
// }
// return dispatch({ type: "setFetchData", key: "info", payload: info });
// loading: false,
// localArtist: action.payload.localArtist,
// info: action.payload.info,
// infoSeason: action.payload.season

// <CardActions className={classes.actions}>
// <IconButton size="small" onClick={() => mediaSelect()}>
//   <IconChevronLeft />
// </IconButton>
// <Button onClick={mediaSet}>Save</Button>
// </CardActions>

// const useStyles = makeStyles(() => ({
//   metadata: {
//     display: "grid",
//     gridTemplateColumns: "1fr 0.5fr 0.3fr",
//     alignItems: "center",
//     gridGap: "1.5rem",
//   },
//   actions: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   underline: {
//     "&&&:before": {
//       borderBottom: "none",
//     },
//     "&&:after": {
//       borderBottom: "none",
//     },
//   },
// }));
