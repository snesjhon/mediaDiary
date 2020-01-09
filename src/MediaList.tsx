import * as React from "react";
import * as firebase from "firebase/app";
import { useState, useEffect } from "react";
// import {
//   Grid,
//   Flex,
//   Text,
//   Box,
//   Icon,
//   Modal,
//   Button,
//   Image
// } from "./components";
// import styled from "styled-components";
import { useStoreState, useStoreActions } from "./config/store";
import { DataByDate, DataByID } from "./config/storeData";
import { MediaTypes } from "./config/storeMedia";
// import DatePicker from "react-date-picker";
// @ts-ignore
// import ReactStars from "react-stars";
import { Grid, Box, Typography, Divider, Dialog } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, styled } from "@material-ui/core/styles";

import DayjsUtils from "@date-io/dayjs";
// import DateFnsUtils from "@date-io/date-fns";

// const MediaMonth = styled(Box)``;
// &:hover .monthDate {
//   color: ${props => props.theme.colors.blue};
// }
// & > .monthContainer:hover {
//   // & .day {
//   //   cursor: pointer;
//   //   color: ${props => props.theme.colors["bg-primary"]};
//   // }
// }

interface MediaListItemProps extends DataByID, DataByDate {
  dayID: string;
  handleClose: () => void;
}

const useStyles = makeStyles(theme => ({
  image: {
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey["300"]}`,
    borderRadius: "5px"
  }
}));

const MediaListItem = ({
  dayID,
  handleClose,
  type,
  star,
  poster,
  title,
  published,
  artist,
  overview,
  seen,
  date
}: MediaListItemProps) => {
  const [localStar, setlocalStar] = useState(star);
  const [localDate, setLocalDate] = useState(date);
  const [localSeen, setLocalSeen] = useState(seen);
  const dataDelete = useStoreActions(actions => actions.data.dataDelete);
  const dataUpdate = useStoreActions(actions => actions.data.dataUpdate);
  const isModified =
    localStar === star && localDate === date && localSeen === seen
      ? true
      : false;
  const gridColumn = type === "album" ? "0.7fr 1fr" : "0.5fr 1fr";
  const classes = useStyles();
  return (
    <>
      <Box p={2}>
        <Grid container spacing={3}>
          <Grid item xs={type === "album" ? 4 : 3}>
            <img className={classes.image} src={poster} />
          </Grid>
          <Grid item xs={type === "album" ? 8 : 9}>
            <Typography variant="h5">
              {title} (
              {new Date(published).toLocaleDateString("en-us", {
                year: "numeric"
              })}
              )
            </Typography>
            <Typography variant="h6">{artist}</Typography>
            <Box py={2}>
              <Typography variant="body1">{overview}</Typography>
            </Box>
            <Box display="flex">
              <Typography>Rating:</Typography>
              <Rating value={localStar} name="rated" precision={0.5} />
            </Box>
            <Box display="flex">
              <Typography>Date:</Typography>
              <MuiPickersUtilsProvider utils={DayjsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={localDate}
                  onChange={() => {}}
                  // onChange={(e) => e !== null ? setLocalDate(e) : null}
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
    // <Card>
    //   <img className={classes.image} src={poster} />
    //   <CardContent>
    //     <Typography>
    // {title} (
    // {new Date(published).toLocaleDateString("en-us", {
    //   year: "numeric"
    // })}
    // )
    //     </Typography>
    //     {artist && <Typography>{artist}</Typography>}
    //     <Typography>{overview}</Typography>
    //   </CardContent>
    // </Card>
    // <Box position="relative">
    //   <Grid gridTemplateColumns={["", gridColumn]} gridGap={["", "1rem"]}>
    //     <Grid gridItem textAlign="center">
    //       <Image src={poster} width={["30vw", ""]} />
    //     </Grid>
    //     <Grid gridItem>
    //       <Text
    //         pt={2}
    //         pb={0}
    //         fontSize={5}
    //         fontWeight={600}
    //         alignItems="center"
    //         textAlign={["center", "left"]}
    //       >
    //         {title}
    //         <Text as="span" fontWeight={300} fontSize={4} ml={2}>
    // (
    // {new Date(published).toLocaleDateString("en-us", {
    //   year: "numeric"
    // })}
    // )
    //         </Text>
    //       </Text>
    // {artist && (
    //   <Text
    //     fontSize={4}
    //     fontWeight={300}
    //     pb={2}
    //     textAlign={["center", "left"]}
    //   >
    //     {artist}
    //   </Text>
    // )}
    //       <Text>{overview}</Text>
    //       <Flex justifyContent="space-between" py={4}>
    //         <Box>
    //           <Text>Rated</Text>
    //           <ReactStars
    //             count={5}
    //             half
    //             value={localStar}
    //             size={20}
    //             color2="var(--primary)"
    //             onChange={(e: any) => setlocalStar(e)}
    //           />
    //         </Box>
    //         <Box>
    //           <Text>On</Text>
    //           <DatePicker
    //             onChange={(date: Date) =>
    //               setLocalDate(firebase.firestore.Timestamp.fromDate(date))
    //             }
    //             value={localDate.toDate()}
    //           />
    //         </Box>
    //         <Box>
    //           <Text>Watched?</Text>
    //           <Icon
    //             mr={2}
    //             cursor="pointer"
    //             height="25px"
    //             width="25px"
    //             stroke="primary"
    //             name={localSeen ? "checked" : "unchecked"}
    //             onClick={() => {
    //               setLocalSeen(!localSeen);
    //             }}
    //           />
    //         </Box>
    //       </Flex>
    //       <Flex mt="auto" pt={2} justifyContent="flex-end">
    //         <Button variant="delete" mr={3} onClick={() => dataDelete(dayID)}>
    //           Delete
    //         </Button>
    //         <Button
    //           variant={isModified ? "secondary" : "primary"}
    //           onClick={dataSave}
    //         >
    //           Save
    //         </Button>
    //       </Flex>
    //     </Grid>
    //   </Grid>
    //   <CloseContainer>
    //     <Icon name="close" onClick={handleClose} />
    //   </CloseContainer>
    // </Box>
  );

  function dataSave() {
    dataUpdate({
      dayID,
      modifiedDate: localDate,
      modifiedSeen: localSeen,
      modifiedStar: localStar,
      cb: () => {
        console.log("updated");
      }
    });
  }
};

const typeStyles = makeStyles(theme => ({
  root: {
    fontWeight: (props: MediaTypes) =>
      props.type === "film" ? "bolder" : undefined,
    textTransform: (props: MediaTypes) =>
      props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
    fontStyle: (props: MediaTypes) =>
      props.type === "album" ? "italic" : undefined
  },
  image: {
    maxWidth: "100%",
    border: `1px solid ${theme.palette.grey["300"]}`,
    borderRadius: "5px"
  }
}));

// const TypedTypography = styled({type, ...other}:MediaTypes) => (<Typography {...other}/>))
// const MyButton = styled(({ type, ...other }: MediaTypes) => (
//   <Typography {...other} />
// ))({
//   fontWeight: (props: MediaTypes) =>
//     props.type === "film" ? "bolder" : undefined,
//   textTransform: (props: MediaTypes) =>
//     props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
//   fontStyle: (props: MediaTypes) =>
//     props.type === "album" ? "italic" : undefined
// });

const TypedTypography = styled(props => <Typography {...props} />)({
  fontWeight: (props: MediaTypes) =>
    props.type === "film" ? "bolder" : undefined
});

// background: (props: MyButtonProps) =>
//   props.color === 'red'
//     ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
//     : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
// border: 0,
// borderRadius: 3,
// boxShadow: (props: MyButtonProps) =>
//   props.color === 'red'
//     ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
//     : '0 3px 5px 2px rgba(33, 203, 243, .3)',
// color: 'white',
// height: 48,
// padding: '0 30px',
// margin: 8,

const MediaList = () => {
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
      const month = new Date(byDate[c].date.seconds * 1000).toLocaleDateString(
        "en-us",
        {
          month: "numeric"
        }
      );
      a[month] = Object.assign({ ...a[month] }, { [c]: byDate[c] });
      return a;
    }, {});
    return (
      <>
        <Grid container spacing={4}>
          <Grid item style={{ width: "6%" }}>
            <Typography variant="button">Month</Typography>
          </Grid>
          <Grid item style={{ width: "5%" }}>
            <Typography variant="button">Day</Typography>
          </Grid>
          <Grid item xs={1}>
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
        <Box pb={2}>
          <Divider />
        </Box>
        {Object.keys(diaryDates)
          .reverse()
          .map((month, monthIndex) => (
            <Box key={monthIndex}>
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
                      mb={
                        dayIndex === Object.keys(diaryDates[month]).length - 1
                          ? 4
                          : undefined
                      }
                      onClick={() =>
                        setData([
                          day,
                          diaryDates[month][day],
                          byID[diaryDates[month][day].id]
                        ])
                      }
                    >
                      <Grid container spacing={4} alignItems="center">
                        <Grid item style={{ width: "6%" }}>
                          {dayIndex === 0 ? (
                            <Typography variant="h6">
                              {new Date(
                                diaryDates[month][day].date.seconds * 1000
                              ).toLocaleDateString("en-us", {
                                month: "short"
                              })}
                            </Typography>
                          ) : (
                            <div />
                          )}
                        </Grid>
                        <Grid item style={{ width: "5%" }}>
                          <Typography variant="h6">
                            {new Date(
                              diaryDates[month][day].date.seconds * 1000
                            ).toLocaleDateString("en-us", {
                              day: "numeric"
                            })}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <img className={classes.image} src={poster} />
                        </Grid>
                        <Grid item xs={3}>
                          <TypedTypography type={type}>{title}</TypedTypography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{artist ? artist : "none"}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Typography>
                            {published
                              ? new Date(published).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric"
                                  }
                                )
                              : "date"}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <Rating
                            name="half-rating"
                            value={star}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                        </Grid>
                        <Grid item xs={1}>
                          Rewatch
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
            </Box>
          ))}
        {typeof data !== "undefined" && (
          <Dialog
            open={typeof data !== "undefined"}
            onClose={() => setData(undefined)}
            maxWidth="md"
          >
            <MediaListItem
              dayID={data[0]}
              {...data[1]}
              {...data[2]}
              handleClose={() => setData(undefined)}
            />
          </Dialog>
        )}
      </>
    );
  } else {
    return <div>loading</div>;
  }
};

export default MediaList;
