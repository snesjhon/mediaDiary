import AppBar from "@material-ui/core/AppBar/AppBar";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useContext } from "react";
import { createPosterURL } from "../config/helpers";
import { IconChevronLeft } from "../icons";
import Day from "./Day";
import Log from "./Log";
import { MDDispatchCtx, MDStateCtx } from "./MediaDiary";
import { useStoreState } from "../store/store";

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
  const byID = useStoreState((state) => state.data.byID);
  const dispatchMedia = useContext(MDDispatchCtx);
  const { selected, day, viewType } = useContext(MDStateCtx);
  let artist, poster, backdrop, published, title, type;
  if (viewType === "day" && typeof day?.id !== "undefined") {
    const daySelected = byID[day.id];
    type = day?.type;
    artist = daySelected?.artist;
    poster = daySelected?.poster;
    // backdrop = daySelected?.backdrop;
    published = daySelected?.published;
    title = daySelected?.title;
  } else {
    artist = selected?.artist;
    poster = selected?.poster;
    backdrop = selected?.backdrop;
    published = selected?.published;
    title = selected?.title;
    type = selected?.type;
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
              onClick={() =>
                dispatchMedia({
                  type: "view",
                  payload: {
                    view: "media",
                    viewType: "search",
                  },
                })
              }
            >
              <IconChevronLeft />
            </IconButton>
            <IconButton
              size="small"
              onClick={() =>
                dispatchMedia({
                  type: "view",
                  payload: {
                    view: "media",
                    viewType: "",
                  },
                })
              }
            >
              <IconChevronLeft />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      {typeof type !== "undefined" && typeof poster !== "undefined" && (
        <>
          <Box
            className={classes.imgBg}
            style={{
              backgroundImage: `url(${
                backdrop !== "" && typeof backdrop !== "undefined"
                  ? createPosterURL({ type, poster: backdrop })
                  : createPosterURL({ type, poster })
              })`,
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
            <img
              className={classes.img}
              src={createPosterURL({ type, poster })}
            />
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
        </>
      )}
      <Box mx={4} py={2}>
        <Divider />
      </Box>
      {viewType === "day" ? <Day /> : <Log />}
    </>
  );
}

export default Diary;
