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
import { useEffect, useReducer, useCallback, useContext } from "react";
import { MBDKEY, MDBURL } from "../config/constants";
import { useStoreActions, useStoreState } from "../store/store";
import { IconChevronLeft, IconRepeat, IconStar } from "../icons";
// import MediaCardInfo from "./MediaCardInfo";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { createPosterURL } from "../config/helpers";
// import { MediaActionType } from "./Media";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import { MDDispatchCtx, MDStateCtx } from "./MediaDiary";
import Log from "./Log";

// type MediaLogState = {
//   date: Date;
//   seen: boolean;
//   star: number;
//   localArtist: string;
//   localPoster: string;
//   loading: boolean;
//   season: any;
//   episode: number;
//   seasons?: any;
// };

// type MediaLogAction = {
//   type: "setData" | "setFetchData" | "setSeasons" | "setSeason";
//   key?: string;
//   payload?: any;
// };

// const MediaLogReducer = (state: MediaLogState, action: MediaLogAction) => {
//   let actionKey = action.key;
//   if (typeof actionKey === "undefined") {
//     actionKey = "";
//   }
//   switch (action.type) {
//     case "setData": {
//       return {
//         ...state,
//         [actionKey]: action.payload,
//       };
//     }
//     case "setFetchData": {
//       return {
//         ...state,
//         loading: false,
//         [actionKey]: action.payload,
//       };
//     }
//     case "setSeasons": {
//       return {
//         ...state,
//         loading: false,
//         localArtist: action.payload.localArtist,
//         localPoster: action.payload.localPoster,
//         season: action.payload.season,
//         seasons: action.payload.seasons,
//       };
//     }
//     case "setSeason": {
//       return {
//         ...state,
//         season: action.payload.season,
//         episode: 1,
//         localPoster: action.payload.localPoster,
//       };
//     }
//     default:
//       return state;
//   }
// };

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 9,
  },
  navColors: {
    backgroundColor: "#F0F0F0",
    // position: "absolute",
  },
  toolbarPad: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  img: {
    maxWidth: "25vw",
    border: `1px solid ${theme.palette.primary.main}`,
  },
  imgBg: {
    zIndex: -1,
    position: "relative",
    height: "15vh",
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  imgBgFilter: {
    // backdropFilter: "blur(10px)",
    height: "100%",
    width: "100%",
  },
  imgContainer: {
    textAlign: "center",
    marginTop: "-5rem",
  },
}));

function Diary() {
  const classes = useStyles();
  // const dispatchMedia = useContext(MDDispatchCtx);
  // const mediaPutFilm = useStoreActions((actions) => actions.media.mediaPutFilm);
  // const mediaPutTV = useStoreActions((actions) => actions.media.mediaPutTV);
  // const mediaPutAlbum = useStoreActions(
  //   (actions) => actions.media.mediaPutAlbum
  // );

  const { selected } = useContext(MDStateCtx);

  // const { id? } = state?.selected;
  // const id = selected?.id;
  const artist = selected?.artist;
  // const overview = selected?.overview;
  const poster = selected?.poster;
  const backdrop = selected?.backdrop;
  const published = selected?.published;
  const title = selected?.title;
  const type = selected?.type;

  if (typeof type !== "undefined" && typeof poster !== "undefined") {
    let posterBackdrop;
    const posterImg = createPosterURL({ type, poster });
    if (typeof backdrop !== "undefined") {
      posterBackdrop = createPosterURL({ type, poster: backdrop });
    }
    return (
      <>
        <Box className={classes.root}>
          <AppBar
            className={classes.navColors}
            position="sticky"
            variant="outlined"
          >
            <Toolbar
              className={classes.toolbarPad}
              variant="dense"
              disableGutters={true}
            >
              <IconButton
                size="small"
                // onClick={() =>
                //   dispatchMedia({ type: "toggleSearch", payload: true })
                // }
              >
                <IconChevronLeft />
              </IconButton>
              <IconButton
                size="small"
                // onClick={() =>
                //   dispatchMedia({ type: "toggleSearch", payload: false })
                // }
              >
                <IconChevronLeft />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Box
          className={classes.imgBg}
          style={{
            backgroundImage: `url(${backdrop !== "" ? backdrop : posterImg})`,
          }}
        >
          <Box
            className={classes.imgBgFilter}
            style={{
              backdropFilter: `blur(${backdrop !== "" ? 0 : "10px"})`,
            }}
          />
        </Box>
        <Box className={classes.imgContainer}>
          <img className={classes.img} src={posterImg} />
        </Box>
        <Box px={4} pt={2} textAlign="center">
          <Typography variant="h4">{title}</Typography>
          <Box display="flex" justifyContent="center">
            <Typography variant="subtitle1" color="textSecondary">
              {typeof published !== "undefined"
                ? new Date(published).toLocaleDateString("en-US", {
                    year: "numeric",
                  })
                : new Date()}
            </Typography>
            {artist && (
              <>
                <Box mx={1}>
                  <Typography color="textSecondary">·</Typography>
                </Box>
                <Typography variant="subtitle1" color="textSecondary">
                  {artist}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <Box mx={4} py={2}>
          <Divider />
        </Box>
        <Log />
        {/* <MediaCardInfo
          id={id}
          title={title}
          published={published}
          artist={localArtist}
          dialogClose={() =>
            dispatchMedia({ type: "toggleSearch", payload: false })
          }
          poster={poster}
          backdrop={typeof posterBackdrop !== "undefined" ? posterBackdrop : ""}
        /> */}
        {/* <Box mx={4}>
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
        </Box> */}
      </>
    );
  } else {
    return <div>Nothing to show</div>;
  }

  // function mediaSet() {
  //   const mediaObj = {
  //     type,
  //     id,
  //     overview,
  //     poster,
  //     published,
  //     title,
  //     seen,
  //     star,
  //     date,
  //     artist: localArtist,
  //   };
  //   if (type === "film") {
  //     saveFilm(mediaObj);
  //   } else if (type === "tv") {
  //     const tvObj = {
  //       ...mediaObj,
  //       id: season.id,
  //       title: title,
  //       artist: localArtist,
  //       season: season.season_number,
  //       episode: episode,
  //       overview: season.overview,
  //       published: season.air_date,
  //       poster: localPoster,
  //     };

  //     saveTV(tvObj);
  //   } else {
  //     saveAlbum(mediaObj);
  //   }
  // }
}

export default Diary;
