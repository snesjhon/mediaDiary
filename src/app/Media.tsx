import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import IconPlus from "../icons/IconPlus";
import { MDDispatchCtx, MDStateCtx } from "./MediaDiary";
import { useState, useEffect, useContext } from "react";
import { useStoreState, useStoreActions } from "../store/store";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography";
import { createPosterURL } from "../config/helpers";
import Box from "@material-ui/core/Box";
import IconStar from "../icons/IconStar";
import Rating from "@material-ui/lab/Rating";
import IconRepeat from "../icons/IconRepeat";
import IconFilm from "../icons/IconFilm";
import Divider from "@material-ui/core/Divider";
import IconMusic from "../icons/IconMusic";
import IconTV from "../icons/IconTV";
import CircularProgress from "@material-ui/core/CircularProgress";
import { DataByDate } from "../store/storeData";
import Search from "./Search";
import Navigation from "./Navigation";

export type MediaTypes = "film" | "tv" | "album" | "";

interface ListState {
  [key: string]: {
    [key: string]: DataByDate;
  };
}

const useStyles = makeStyles((theme) => ({
  mediaFab: {
    position: "fixed",
    bottom: "4vh",
    marginLeft: "1rem",
    marginBottom: "-1.5rem",
  },
  mediaImage: {
    display: "block",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "5px",
    "&:hover": {
      border: `1px solid ${theme.palette.primary.main}`,
      outline: `2px solid ${theme.palette.primary.main}`,
      borderRadius: 0,
      cursor: "pointer",
    },
  },
  mediaListTitle: {
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
}));

function Media() {
  const byID = useStoreState((state) => state.data.byID);
  const byDate = useStoreState((state) => state.data.byDate);
  const dataGet = useStoreActions((actions) => actions.data.dataGet);

  const dispatchMD = useContext(MDDispatchCtx);
  const state = useContext(MDStateCtx);
  const [filterBy, setFilterBy] = useState("");

  const classes = useStyles();
  // I'm not sure if we should be getting everyttime. I know there was a reason
  // why I didn't go this way, but maybe a good thing to return to.
  useEffect(() => {
    dataGet();
  }, [dataGet]);

  let diaryDates: ListState = {};

  if (Object.keys(byID).length > 0 && Object.keys(byDate).length > 0) {
    diaryDates = Object.keys(byDate)
      .filter((e) => (filterBy === "" ? e : byDate[e].type === filterBy))
      .reduce<ListState>((a, c) => {
        const dateString = byDate[c].date.toDate().toLocaleDateString("en-us", {
          month: "short",
          year: "numeric",
        });
        a[`01-${dateString}`] = Object.assign(
          { ...a[`01-${dateString}`] },
          { [c]: byDate[c] }
        );
        return a;
      }, {});
  }

  return (
    <>
      {state.viewType === "search" ? <Search /> : <Navigation />}
      {Object.keys(byID).length > 0 &&
      Object.keys(byDate).length > 0 &&
      Object.keys(diaryDates).length > 0 ? (
        <>
          {Object.keys(diaryDates)
            .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))
            .map((month, monthIndex) => {
              return (
                <Grid container key={monthIndex}>
                  <Grid item xs={2}>
                    <Typography
                      variant="h5"
                      style={{
                        position: "sticky",
                        top: "4.1rem",
                        marginTop: "1rem",
                        textAlign: "center",
                      }}
                    >
                      {new Date(month).toLocaleDateString("en-us", {
                        month: "short",
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    {Object.keys(diaryDates[month])
                      .sort(
                        (a, b) =>
                          diaryDates[month][b].date.seconds -
                          diaryDates[month][a].date.seconds
                      )
                      .map((day, dayIndex) => {
                        const {
                          title,
                          poster,
                          published,
                          artist,
                          type,
                          overview,
                        } = byID[diaryDates[month][day].id];
                        const { star, seen, season, episode } = diaryDates[
                          month
                        ][day];
                        const localPoster = createPosterURL({
                          type,
                          poster,
                          size: 200,
                        });
                        return (
                          <React.Fragment key={monthIndex + dayIndex}>
                            <Grid container>
                              <Grid item xs={1}>
                                <Box pt={2}>
                                  <Typography variant="h6">
                                    {new Date(
                                      diaryDates[month][day].date.toDate()
                                    ).toLocaleDateString("en-us", {
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={3}>
                                <Box px={1} py={2}>
                                  <img
                                    className={classes.mediaImage}
                                    src={localPoster}
                                    onClick={() =>
                                      dispatchMD({
                                        type: "view",
                                        payload: {
                                          view: "diary",
                                          viewType: "day",
                                          day: {
                                            ...diaryDates[month][day],
                                            mediaID: day,
                                          },
                                        },
                                      })
                                    }
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={7}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Box pt={2} pl={1} pr={0}>
                                  <Typography
                                    className={classes.mediaListTitle}
                                    onClick={() =>
                                      dispatchMD({
                                        type: "view",
                                        payload: {
                                          view: "diary",
                                          viewType: "day",
                                          day: {
                                            ...diaryDates[month][day],
                                            mediaID: day,
                                          },
                                        },
                                      })
                                    }
                                  >
                                    {title}
                                  </Typography>
                                  <Box
                                    display="flex"
                                    my={1}
                                    alignItems="center"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {new Date(published).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                        }
                                      )}
                                    </Typography>
                                    <Box mx={1}>
                                      <Typography color="textSecondary">
                                        ·
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {artist}
                                    </Typography>
                                  </Box>
                                  {(typeof season !== "undefined" ||
                                    typeof episode !== "undefined") && (
                                    <Box display="flex" mb={1}>
                                      {typeof season !== "undefined" && (
                                        <>
                                          <Typography
                                            variant="subtitle2"
                                            color="textSecondary"
                                          >
                                            Season {season}
                                          </Typography>
                                          <Box mx={1}>
                                            <Typography color="textSecondary">
                                              ·
                                            </Typography>
                                          </Box>
                                        </>
                                      )}
                                      {typeof episode !== "undefined" && (
                                        <Typography
                                          variant="subtitle2"
                                          color="textSecondary"
                                        >
                                          Episode {episode}
                                        </Typography>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                                <Box
                                  mt="auto"
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  pb={2}
                                  pl={1}
                                  pr={0}
                                >
                                  <Box display="flex" alignItems="center">
                                    <Rating
                                      name="half-rating"
                                      value={star}
                                      precision={0.5}
                                      size="small"
                                      readOnly
                                      emptyIcon={
                                        <IconStar
                                          width={15}
                                          height={15}
                                          empty
                                          fill="#03b021"
                                        />
                                      }
                                      icon={
                                        <IconStar
                                          width={15}
                                          height={15}
                                          fill="#03b021"
                                          stroke="#03b021"
                                        />
                                      }
                                    />
                                  </Box>
                                  <Box display="flex">
                                    <Box pr={2}>
                                      {seen && (
                                        <IconRepeat width={15} height={15} />
                                      )}
                                    </Box>
                                    {type === "film" && (
                                      <IconFilm
                                        width={15}
                                        height={15}
                                        stroke="rgba(0, 0, 0, 0.54)"
                                      />
                                    )}
                                    {type === "tv" && (
                                      <IconTV
                                        width={15}
                                        height={15}
                                        stroke="rgba(0, 0, 0, 0.54)"
                                      />
                                    )}
                                    {type === "album" && (
                                      <IconMusic
                                        width={15}
                                        height={15}
                                        stroke="rgba(0, 0, 0, 0.54)"
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                            <Divider />
                          </React.Fragment>
                        );
                      })}
                  </Grid>
                </Grid>
              );
            })}
          <Fab
            className={classes.mediaFab}
            color="primary"
            size="small"
            onClick={() =>
              dispatchMD({
                type: "view",
                payload: {
                  view: "media",
                  viewType: "search",
                },
              })
            }
          >
            <IconPlus />
          </Fab>
        </>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export default Media;
