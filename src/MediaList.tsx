import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Avatar
} from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "./config/store";
import { DataByDate, DataByID } from "./config/storeData";
import { MediaTypes } from "./config/storeMedia";
import Rating from "@material-ui/lab/Rating";
// import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import { LiveTv, MusicVideo, MovieOutlined } from "@material-ui/icons";
import useBP from "./hooks/useBP";

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "5px"
  },
  tableHeadings: {
    gridTemplateColumns: "5rem 1fr",
    gridGap: "1rem",
    display: "grid",
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
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transition:
        "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    },
    "&:hover .mediaListCTA": {
      visibility: "visible",
      transition:
        "all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
    }
  },
  // mediaListItem:{
  //   paddingTop: theme.spacing(2),
  //   paddingBottom: theme.spacing(2),
  // },
  mediaImage: {
    display: "block",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "5px"
  }
}));

const TypedTypography = styled(props => <Typography {...props} />)({
  fontWeight: (props: MediaTypes) =>
    props.type === "film" ? "bolder" : undefined,
  textTransform: (props: MediaTypes) =>
    props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
  fontStyle: (props: MediaTypes) =>
    props.type === "album" ? "italic" : undefined
});

function MediaList() {
  const [data, setData] = useState<[string, DataByDate, DataByID]>();
  const byID = useStoreState(state => state.data.byID);
  const byDate = useStoreState(state => state.data.byDate);
  const dataGet = useStoreActions(actions => actions.data.dataGet);

  const classes = useStyles();
  const bp = useBP();

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
          <Box display="grid" className={classes.mediaList}>
            <Box textAlign="center">Day</Box>
            <Box>Poster</Box>
            <Box>Title</Box>
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
                  gridTemplateColumns: bp !== "mobile" ? "5rem 1fr" : "3rem 1fr"
                }}
              >
                <Box>
                  <Typography
                    variant={bp !== "mobile" ? "h4" : "h5"}
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
                      const { title, poster, published, artist, type } = byID[
                        diaryDates[month][day].id
                      ];
                      const { star, seen } = diaryDates[month][day];
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
                              <Box
                                display="flex"
                                justifyContent="space-between"
                              >
                                <Typography>
                                  <Box
                                    component="span"
                                    fontWeight="fontWeightBold"
                                    style={{ textTransform: "uppercase" }}
                                  >
                                    {title}
                                  </Box>
                                </Typography>
                              </Box>
                              <Box display="flex" my={1}>
                                <Typography>
                                  {new Date(published).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric"
                                    }
                                  )}
                                </Typography>
                                <Box mx={1}>
                                  <Typography>·</Typography>
                                </Box>
                                <Typography>{artist}</Typography>
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
                                      <StarBorderIcon fontSize="small" />
                                    }
                                    icon={
                                      <StarIcon
                                        fontSize="small"
                                        color="primary"
                                      />
                                    }
                                  />
                                </Box>
                                <Box
                                  className="mediaListCTA"
                                  visibility="hidden"
                                >
                                  <Tooltip
                                    title="Show Overview"
                                    placement="left"
                                  >
                                    <IconButton>
                                      <DescriptionIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title="Show Overview"
                                    placement="top"
                                  >
                                    <IconButton>
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Box pt={bp !== "mobile" ? 3 : undefined}>
                            <Divider />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            );
          })}
      </>
    );
  } else {
    return <div>loading</div>;
  }
}

{
  /* <IconButton color="secondary">
<AddShoppingCartIcon />
</IconButton>
<IconButton color="secondary">
<AddShoppingCartIcon />
</IconButton>
<IconButton color="secondary">
<AddShoppingCartIcon />
</IconButton>
{star}
{seen.toString()} */
}
// {/* <Typography>{published}</Typography> */}

// const TypedTypography = styled(props => <Typography {...props} />)({
//   fontWeight: (props: MediaTypes) =>
//     props.type === "film" ? "bolder" : undefined,
//   textTransform: (props: MediaTypes) =>
//     props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
//   fontStyle: (props: MediaTypes) =>
//     props.type === "album" ? "italic" : undefined
// });

export default MediaList;
