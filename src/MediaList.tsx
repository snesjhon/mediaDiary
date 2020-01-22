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
import {
  Grid,
  Box,
  Typography,
  Divider,
  Dialog,
  Tooltip
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Rating from "@material-ui/lab/Rating";
import { makeStyles, styled } from "@material-ui/core/styles";
import DayjsUtils from "@date-io/dayjs";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DescriptionIcon from "@material-ui/icons/Description";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";

interface MediaListItemProps extends DataByID, DataByDate {
  dayID: string;
  handleClose: () => void;
}

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
  tableItem: {
    "& div:nth-child(4) p:hover": {
      cursor: "pointer",
      color: theme.palette.primary.dark
    }
  },
  card: {
    maxWidth: 345
  },
  media: {
    // height: 0,
    // paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  cardHeader: {
    // color: theme.palette.primary.dark
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
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          // avatar={
          //   <Avatar aria-label="recipe" className={classes.avatar}>
          //     R
          //   </Avatar>
          // }
          // action={
          //   <Typography>Jan 19</Typography>
          //   // <IconButton aria-label="settings">
          //   //   <MoreVertIcon />
          //   // </IconButton>
          // }
          title={`${title} (${new Date(published).toLocaleDateString("en-us", {
            year: "numeric"
          })})`}
          subheader={artist}
        />
        <CardMedia
          component="img"
          className={classes.media}
          image={poster}
          title="Paella dish"
        />
        {/* <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to
            cook together with your guests. Add 1 cup of frozen peas along with
            the mussels, if you like.
          </Typography>
        </CardContent> */}
        <CardActions
          disableSpacing={true}
          style={{ justifyContent: "space-between" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box mr={2}>
              <Typography variant="h6">
                {new Date(localDate.toDate()).toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric"
                })}
              </Typography>
            </Box>
            <Rating
              value={localStar}
              name="rated"
              precision={0.5}
              size="small"
              readOnly
              emptyIcon={<StarBorderIcon fontSize="small" />}
              icon={<StarIcon fontSize="small" color="primary" />}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            {(overview !== "" || typeof overview === "undefined") && (
              <Tooltip title="Show Overview" placement="left">
                <IconButton onClick={handleExpandClick}>
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton>
              <EditIcon />
            </IconButton>
          </Box>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>{overview}</CardContent>
        </Collapse>
      </Card>
    </>
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

const TypedTypography = styled(props => <Typography {...props} />)({
  fontWeight: (props: MediaTypes) =>
    props.type === "film" ? "bolder" : undefined,
  textTransform: (props: MediaTypes) =>
    props.type === "film" || props.type === "tv" ? "uppercase" : undefined,
  fontStyle: (props: MediaTypes) =>
    props.type === "album" ? "italic" : undefined
});

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
        <Grid className={classes.tableHeadings} container spacing={4}>
          <Grid item style={{ width: "6%" }}>
            Month
          </Grid>
          <Grid item style={{ width: "5%" }}>
            Day
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
                      className={classes.tableItem}
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
                            emptyIcon={<StarBorderIcon fontSize="small" />}
                            icon={<StarIcon fontSize="small" color="primary" />}
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

{
  /* <Box p={2}>
<Grid container spacing={3}>
  <Grid item xs={type === "album" ? 4 : 4}>
    <img className={classes.image} src={poster} />
  </Grid>
  <Grid container item xs={type === "album" ? 8 : 8} direction="column">
    <Typography component="h5" variant="h5">
      {title}
      <Box component="span" fontWeight="light">
        (
        {new Date(published).toLocaleDateString("en-us", {
          year: "numeric"
        })}
        )
      </Box>
    </Typography>
    <Typography variant="subtitle1" color="textSecondary">
      {artist}
    </Typography>
    <Box display="flex" mt="auto">
      <Box mr={3}>
        <Typography>Rating:</Typography>
        <Rating value={localStar} name="rated" precision={0.5} />
      </Box>
      <Box mr={3}>
        <Typography>Date:</Typography>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <KeyboardDatePicker
            disableToolbar
            disableFuture
            variant="inline"
            format="MM/DD/YYYY"
            value={localDate.toDate()}
            autoOk={true}
            onChange={e => {
              setLocalDate(
                e !== null && e.toDate() !== null
                  ? firebase.firestore.Timestamp.fromDate(e.toDate())
                  : firebase.firestore.Timestamp.now()
              );
            }}
            // onChange={(e) => e !== null ? setLocalDate(e) : null}
            KeyboardButtonProps={{
              "aria-label": "change date"
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    </Box>
  </Grid>
</Grid>
</Box> */
}
