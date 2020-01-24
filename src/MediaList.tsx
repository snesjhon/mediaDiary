import { Box, Typography, Grid, Divider } from "@material-ui/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { makeStyles, styled } from "@material-ui/core/styles";
import { useStoreActions, useStoreState } from "./config/store";
import { DataByDate, DataByID } from "./config/storeData";
import { MediaTypes } from "./config/storeMedia";

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "5px"
  },
  tableHeadings: {
    "& > *": {
      textTransform: "uppercase",
      color: theme.palette.grey[500],
      fontSize: theme.typography.button.fontSize
    }
  },
  mediaList: {
    gridTemplateColumns: "3rem 3rem 5rem 3rem 3rem 3rem 3rem",
    gridGap: "2rem"
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
        <Grid className={classes.tableHeadings} container direction="row">
          <Grid item xs={1}>
            Month
          </Grid>
          <Grid item xs={11}>
            <Grid container spacing={3} alignItems="center">
              <Grid item style={{ width: "5%" }}>
                Day
              </Grid>
              <Grid item style={{ width: "10%" }}>
                Poster
              </Grid>
              <Grid item xs={3}>
                Title
              </Grid>
              <Grid item xs={3}>
                Artist
              </Grid>
              <Grid item xs={1}>
                Released
              </Grid>
              <Grid item xs={1}>
                Rating
              </Grid>
              <Grid item xs={1}>
                Rewatch
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box pb={2}>
          <Divider />
        </Box>
        {Object.keys(diaryDates)
          .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))
          .map((month, monthIndex) => {
            return (
              <Box
                display="flex"
                style={{ gridTemplateColumns: "1fr 1fr" }}
                key={monthIndex}
              >
                <Box style={{ position: "sticky", top: 0 }} mt={3} pt={1}>
                  <Typography variant="h4">
                    {new Date(month).toLocaleDateString("en-us", {
                      month: "short"
                    })}
                  </Typography>
                </Box>
                <Box>
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
                        <Box
                          key={monthIndex + dayIndex}
                          display="grid"
                          className={classes.mediaList}
                        >
                          <Box>
                            <Typography variant="h6">
                              {new Date(
                                diaryDates[month][day].date.toDate()
                              ).toLocaleDateString("en-us", {
                                day: "numeric"
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <img src={poster} style={{ maxWidth: "100%" }} />
                          </Box>
                          <Box>
                            <Typography>{title}</Typography>
                          </Box>
                          <Box>
                            <Typography>{artist}</Typography>
                          </Box>
                          <Box>
                            <Typography>{published}</Typography>
                          </Box>
                          <Box>{star}</Box>
                          <Box>{seen.toString()}</Box>
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

// const TypedTypography = styled(props => <Typography {...props} />)({
//   fontWeight: (props: MediaTypes) =>
//     props.type === "film" ? "bolder" : undefined,
//   textTransform: (props: MediaTypes) =>
//     props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
//   fontStyle: (props: MediaTypes) =>
//     props.type === "album" ? "italic" : undefined
// });

export default MediaList;
