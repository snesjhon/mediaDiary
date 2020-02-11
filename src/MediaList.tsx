import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import * as React from "react";
import { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import { DataByDate } from "./config/storeData";
import { IconFilm, IconMusic, IconPlus, IconStar, IconTV } from "./icons";
import MediaDialog, { viewType } from "./MediaDialog";

const useStyles = makeStyles(theme => ({
  tableHeadings: {
    gridTemplateColumns: "5rem 1fr",
    gridGap: "1rem",
    display: "grid",
    alignItems: "center",
    position: "sticky",
    top: "0",
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    paddingTop: "1rem",
    zIndex: 9,
    "& > *": {
      textTransform: "uppercase",
      color: theme.palette.grey[500],
      fontSize: theme.typography.button.fontSize
    }
  },
  tableHeadingList: {
    gridTemplateColumns: "3rem 6rem 0.9fr 1fr",
    gridGap: "2rem",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },
  mediaContainer: {
    gridGap: "1rem",
    display: "grid"
  },
  mediaListContainer: {
    display: "grid",
    gridGap: "1.5rem"
  },
  mediaList: {
    gridTemplateColumns: "3rem 6rem 1fr",
    gridGap: "2rem",
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      transition: `all ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut} 0ms`
    }
  },
  mediaListItem: {
    alignItems: "center",
    gridTemplateColumns: "3rem 6rem 1fr 1fr",
    gridGap: "2rem"
  },
  mediaImage: {
    display: "block",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "5px"
  },
  mediaFab: {
    position: "sticky",
    bottom: "4vh",
    marginLeft: "1rem",
    marginBottom: "-1.5rem"
  },
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh"
  }
}));

export interface MediaListView {
  open: boolean;
  type: viewType;
  mediaID?: string;
}

function MediaList() {
  const classes = useStyles();
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const byID = useStoreState(state => state.data.byID);
  const byDate = useStoreState(state => state.data.byDate);
  const dataGet = useStoreActions(actions => actions.data.dataGet);

  // const [dialogOpen, setDialogOpen] = useState(false);
  const [listView, setListView] = useState<MediaListView>({
    open: false,
    type: "search",
    mediaID: ""
  });

  useEffect(() => {
    dataGet();
  }, [dataGet]);

  if (typeof byID !== "undefined" && typeof byDate !== "undefined") {
    const diaryDates = Object.keys(byDate).reduce<{
      [key: string]: {
        [key: string]: DataByDate;
      };
    }>((a, c) => {
      const dateString = byDate[c].date.toDate().toLocaleDateString("en-us", {
        month: "short",
        year: "numeric"
      });
      a[`01-${dateString}`] = Object.assign(
        { ...a[`01-${dateString}`] },
        { [c]: byDate[c] }
      );
      return a;
    }, {});

    return (
      <>
        <Box className={classes.tableHeadings}>
          <Box>Month</Box>
          <Box display="grid" className={classes.tableHeadingList}>
            <Box textAlign="center">Day</Box>
            <Box>Poster</Box>
            <Box>Title</Box>
            <Breadcrumbs aria-label="breadcrumb">
              <Box display="flex">
                <Typography
                  align="center"
                  style={{
                    color: "#9e9e9e",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  32
                  <Box display="flex" component="span" ml={1}>
                    <IconFilm />
                  </Box>
                </Typography>
              </Box>
              <Typography
                align="center"
                style={{
                  color: "#9e9e9e",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                20
                <Box display="flex" component="span" ml={1}>
                  <IconTV />
                </Box>
              </Typography>
              <Typography
                align="center"
                style={{
                  color: "#9e9e9e",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                11
                <Box display="flex" component="span" ml={1}>
                  <IconMusic />
                </Box>
              </Typography>
            </Breadcrumbs>
          </Box>
        </Box>
        {Object.keys(diaryDates)
          .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))
          .map((month, monthIndex) => {
            return (
              <Box
                className={classes.mediaContainer}
                key={monthIndex}
                style={{
                  gridTemplateColumns: "5rem 1fr"
                }}
              >
                <Box mt={1}>
                  <Typography
                    variant="h4"
                    style={{ position: "sticky", top: "3rem" }}
                  >
                    {new Date(month).toLocaleDateString("en-us", {
                      month: "short"
                    })}
                  </Typography>
                </Box>
                <Box className={classes.mediaListContainer}>
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
                        overview
                      } = byID[diaryDates[month][day].id];
                      const { star, id } = diaryDates[month][day];
                      return (
                        <Box key={monthIndex + dayIndex}>
                          <Box
                            display="grid"
                            className={classes.mediaList}
                            py={1}
                          >
                            <Box textAlign="center">
                              <Typography
                                variant="h6"
                                style={{ marginTop: "0.5rem" }}
                              >
                                {new Date(
                                  diaryDates[month][day].date.toDate()
                                ).toLocaleDateString("en-us", {
                                  day: "numeric"
                                })}
                              </Typography>
                            </Box>
                            <Box>
                              <img
                                className={classes.mediaImage}
                                src={poster}
                              />
                            </Box>
                            <Box display="flex" flexDirection="column">
                              <Typography variant="h5" component="h5">
                                {title}
                              </Typography>
                              <Box display="flex" my={1}>
                                <Typography
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {new Date(published).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric"
                                    }
                                  )}
                                </Typography>
                                <Box mx={1}>
                                  <Typography color="textSecondary">
                                    ·
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {artist}
                                </Typography>
                              </Box>
                              <Box
                                mt="auto"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
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
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      setListView({
                                        open: true,
                                        type: "edit",
                                        mediaID: day
                                      })
                                    }
                                  >
                                    Edit
                                  </Button>
                                  {overview !== "" && (
                                    <Button
                                      size="small"
                                      onClick={() =>
                                        setListView({
                                          open: true,
                                          type: "edit",
                                          mediaID: day
                                        })
                                      }
                                    >
                                      Overview
                                    </Button>
                                  )}
                                </Box>
                                <Box pr={2}>
                                  {type === "film" && (
                                    <IconFilm stroke="rgba(0, 0, 0, 0.54)" />
                                  )}
                                  {type === "tv" && (
                                    <IconTV stroke="rgba(0, 0, 0, 0.54)" />
                                  )}
                                  {type === "album" && (
                                    <IconMusic stroke="rgba(0, 0, 0, 0.54)" />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box pt={3}>
                            <Divider />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            );
          })}
        <Fab
          className={classes.mediaFab}
          color="primary"
          onClick={() => setListView({ open: true, type: "search" })}
        >
          <IconPlus />
        </Fab>
        {listView.open && (
          <MediaDialog listView={listView} dialogClose={dialogClose} />
        )}
      </>
    );
  } else {
    return <div>loading</div>;
  }

  function dialogClose() {
    mediaSelect();
    return setListView({ open: false, type: "search" });
    // return setDialogOpen(false);
  }
}

export default MediaList;
