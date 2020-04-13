import Box from "@material-ui/core/Box";
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
import {
  IconFilm,
  IconMusic,
  IconPlus,
  IconRepeat,
  IconStar,
  IconTV,
} from "./icons";
import MediaDialog, { viewType } from "./MediaDialog";
import { createPosterURL } from "./utilities/helpers";
import MediaSearch from "./MediaSearch";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  tableHeadings: {
    gridTemplateColumns: "8.5rem 1fr",
    gridGap: "1rem",
    display: "grid",
    alignItems: "center",
    position: "sticky",
    top: "0",
    borderBottom: `5px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    paddingTop: "1rem",
    zIndex: 9,
    // "& > *": {
    //   textTransform: "uppercase",
    //   color: theme.palette.grey[500]
    // }
  },
  tableHeadingList: {
    gridTemplateColumns: "3rem 6rem 0.9fr 1fr",
    gridGap: "2rem",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  tableHeadingIcons: {
    display: "flex",
    "& > div": {
      display: "flex",
      alignItems: "center",
    },
    "& > div:hover": {
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
  mediaContainer: {
    gridGap: "1rem",
    display: "grid",
  },
  mediaListContainer: {
    display: "grid",
    gridGap: "1.5rem",
  },
  mediaList: {
    gridTemplateColumns: "3rem 6rem 1fr",
    gridGap: "2rem",
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
      transition: `all ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut} 0ms`,
    },
  },
  mediaListItem: {
    alignItems: "center",
    gridTemplateColumns: "3rem 6rem 1fr 1fr",
    gridGap: "2rem",
  },
  mediaListTitle: {
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
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
  mediaFab: {
    position: "sticky",
    bottom: "4vh",
    marginLeft: "1rem",
    marginBottom: "-1.5rem",
  },
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh",
  },
}));

export interface MediaListView {
  open: boolean;
  type: viewType;
  mediaID?: string;
  showOverview?: boolean;
  showEdit?: boolean;
}

interface MediaDiaryList {
  [key: string]: {
    [key: string]: DataByDate;
  };
}

function MediaList() {
  const classes = useStyles();
  const mediaSelect = useStoreActions((actions) => actions.media.mediaSelect);
  const byID = useStoreState((state) => state.data.byID);
  const byDate = useStoreState((state) => state.data.byDate);
  const dataGet = useStoreActions((actions) => actions.data.dataGet);

  const [listView, setListView] = useState<MediaListView>({
    open: false,
    type: "search",
    mediaID: "",
  });
  const [filterBy, setFilterBy] = useState("");

  useEffect(() => {
    dataGet();
  }, [dataGet]);

  let diaryDates: MediaDiaryList = {};

  if (Object.keys(byID).length > 0 && Object.keys(byDate).length > 0) {
    diaryDates = Object.keys(byDate)
      .filter((e) => (filterBy === "" ? e : byDate[e].type === filterBy))
      .reduce<MediaDiaryList>((a, c) => {
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
      <MediaSearch setViewType={() => {}} dialogClose={dialogClose} />
      <Box p={2} mt={8}>
        {Object.keys(byID).length > 0 &&
        Object.keys(byDate).length > 0 &&
        Object.keys(diaryDates).length > 0 ? (
          Object.keys(diaryDates)
            .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))
            .map((month, monthIndex) => {
              return (
                <Box
                  className={classes.mediaContainer}
                  key={monthIndex}
                  style={{
                    gridTemplateColumns: "5rem 1fr",
                  }}
                >
                  <Box mt={1}>
                    <Typography
                      variant="h4"
                      style={{ position: "sticky", top: "5.6rem" }}
                    >
                      {new Date(month).toLocaleDateString("en-us", {
                        month: "short",
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
                          <Box key={monthIndex + dayIndex}>
                            <Box
                              display="grid"
                              className={classes.mediaList}
                              py={1}
                            >
                              <Typography variant="h6" component="h6">
                                <Box textAlign="center" mt={1}>
                                  {new Date(
                                    diaryDates[month][day].date.toDate()
                                  ).toLocaleDateString("en-us", {
                                    day: "numeric",
                                  })}
                                </Box>
                              </Typography>
                              <Box>
                                <img
                                  className={classes.mediaImage}
                                  src={localPoster}
                                  onClick={() =>
                                    setListView({
                                      open: true,
                                      type: "edit",
                                      mediaID: day,
                                    })
                                  }
                                />
                              </Box>
                              <Box display="flex" flexDirection="column">
                                <Typography
                                  className={classes.mediaListTitle}
                                  variant="h5"
                                  component="h5"
                                  onClick={() =>
                                    setListView({
                                      open: true,
                                      type: "edit",
                                      mediaID: day,
                                    })
                                  }
                                >
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
                                    variant="subtitle1"
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
                                          variant="subtitle1"
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
                                        variant="subtitle1"
                                        color="textSecondary"
                                      >
                                        Episode {episode}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
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
                                          mediaID: day,
                                          showEdit: true,
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
                                            mediaID: day,
                                            showOverview: true,
                                          })
                                        }
                                      >
                                        Overview
                                      </Button>
                                    )}
                                  </Box>
                                  <Box display="flex" pr={2}>
                                    <Box pr={2}>{seen && <IconRepeat />}</Box>
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
            })
        ) : (
          <CircularProgress />
        )}
      </Box>
      {listView.open && (
        <MediaDialog listView={listView} dialogClose={dialogClose} />
      )}
    </>
  );
  // } else {
  //   return <CircularProgress />;
  // }

  function dialogClose() {
    mediaSelect();
    return setListView({ open: false, type: "search" });
  }
}

export default MediaList;
//  {/* <Fab
//           className={classes.mediaFab}
//           color="primary"
//           onClick={() => setListView({ open: true, type: "search" })}
//         >
//           <IconPlus />
//         </Fab> */}
// <Box mb={1}>Month</Box>
//           <Box display="grid" className={classes.tableHeadingList}>
//             <Box textAlign="center">Day</Box>
//             <Box>Poster</Box>
//             <Box>Title</Box>
//             <Box className={classes.tableHeadingIcons}>
//               {filterBy !== "" && (
//                 <Button size="small" onClick={() => setFilterBy("")}>
//                   X
//                 </Button>
//               )}
//               {Object.keys(dataCounts).map((e: string, i: number) => (
//                 <Box key={e} onClick={() => setFilterBy(e)}>
//                   <Typography component="div">
//                     <Box mr={1}>{dataCounts[e]}</Box>
//                   </Typography>
//                   {e === "tv" && <IconTV />}
//                   {e === "film" && <IconFilm />}
//                   {e === "album" && <IconMusic />}
//                   {(i === 0 || i === 1) && (
//                     <Typography component="div">
//                       <Box px={2}>/</Box>
//                     </Typography>
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           </Box>

// const dataCounts = Object.keys(byID).reduce<{
//   [key: string]: number;
// }>((a, c) => {
//   if (typeof a[byID[c]["type"]] !== "undefined") {
//     a[byID[c]["type"]] = ++a[byID[c]["type"]];
//   } else {
//     a[byID[c]["type"]] = 1;
//   }
//   return a;
// }, {});
