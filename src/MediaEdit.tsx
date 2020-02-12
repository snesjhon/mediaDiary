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
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import * as React from "react";
import { useReducer } from "react";
import { IconChevronLeft, IconRepeat, IconStar } from "./icons";
import MediaInfo from "./MediaInfo";
import { MediaListView } from "./MediaList";
import { useStoreActions, useStoreState } from "./config/store";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles(theme => ({
  metadata: {
    display: "grid",
    gridTemplateColumns: "1fr 0.5fr 0.3fr",
    alignItems: "center",
    gridGap: "1.5rem",
    marginBottom: 0
  },
  actions: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

type StateType = {
  expanded: boolean;
  localDate: Date;
  localSeen: boolean;
  localStar: number;
};

type ActionType = {
  type: "expanded" | "setLocalDate" | "setLocalSeen" | "setLocalStar";
  payload?: any;
};

const MediaEditReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "expanded": {
      return {
        ...state,
        expanded: action.payload
      };
    }
    case "setLocalDate": {
      return {
        ...state,
        localDate: action.payload
      };
    }
    case "setLocalSeen": {
      return {
        ...state,
        localSeen: action.payload
      };
    }
    case "setLocalStar": {
      return {
        ...state,
        localStar: action.payload
      };
    }
    default:
      return state;
  }
};
interface MediaEditProps {
  listView: MediaListView;
  dialogClose: () => void;
}

function MediaEdit({ listView, dialogClose }: MediaEditProps) {
  const byDate = useStoreState(state => state.data.byDate);
  const byID = useStoreState(state => state.data.byID);
  const mediaPutFilm = useStoreActions(actions => actions.media.mediaPutFilm);
  const mediaPutTV = useStoreActions(actions => actions.media.mediaPutTV);
  const mediaPutAlbum = useStoreActions(actions => actions.media.mediaPutAlbum);

  const { mediaID } = listView;
  const { id, seen, star, type } = byDate[
    typeof mediaID !== "undefined" ? mediaID : ""
  ];
  const { artist, overview, poster, title, season, published } = byID[id];

  const [{ expanded, localDate, localSeen, localStar }, dispatch] = useReducer(
    MediaEditReducer,
    {
      expanded: false,
      localDate: published,
      localStar: star,
      localSeen: seen
    }
  );

  const classes = useStyles();
  return (
    <>
      <MediaInfo
        id={id}
        title={title}
        published={published}
        artist={artist}
        dialogClose={dialogClose}
        poster={poster}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>{overview}</Typography>
        </CardContent>
      </Collapse>
      <CardContent className={classes.actions}>
        <Typography variant="h6">
          {new Date(published).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric"
          })}
        </Typography>
        <Rating
          name="half-rating"
          value={star}
          precision={0.5}
          size="small"
          readOnly
          emptyIcon={<IconStar width={15} height={15} empty fill="#03b021" />}
          icon={
            <IconStar width={15} height={15} fill="#03b021" stroke="#03b021" />
          }
        />
        <IconButton>
          <IconRepeat stroke={localSeen ? "blue" : undefined} />
        </IconButton>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <IconButton>
          <IconRepeat stroke={localSeen ? "blue" : undefined} />
        </IconButton>
        <IconButton
          onClick={() => dispatch({ type: "expanded", payload: !expanded })}
        >
          <IconRepeat stroke={localSeen ? "blue" : undefined} />
        </IconButton>
      </CardActions>
    </>
  );
}

export default MediaEdit;

//   <Typography variant="h6">
//   <MuiPickersUtilsProvider utils={DayjsUtils}>
//     <KeyboardDatePicker
//       disableToolbar
//       disableFuture
//       variant="inline"
//       format="MM/DD/YYYY"
//       value={localDate}
//       autoOk={true}
//       onChange={e =>
//         e !== null
//           ? dispatch({ type: "setLocalDate", payload: e.toDate() })
//           : null
//       }
//       KeyboardButtonProps={{
//         "aria-label": "change date"
//       }}
//     />
//   </MuiPickersUtilsProvider>
// </Typography>
// <Rating
//   value={localStar}
//   name="rated"
//   precision={0.5}
//   onChange={(_, newValue: number) =>
//     dispatch({ type: "setLocalStar", payload: newValue })
//   }
//   emptyIcon={<IconStar empty fill="#03b021" />}
//   icon={<IconStar fill="#03b021" stroke="#03b021" />}
// />
// <Box>
//   <Tooltip title="Seen Before?" placement="top">
// <IconButton
//   onClick={() =>
//     dispatch({ type: "setLocalSeen", payload: !localSeen })
//   }
// >
//   <IconRepeat stroke={localSeen ? "blue" : undefined} />
// </IconButton>
//   </Tooltip>
// </Box>

// const [date, setDate] = useState(new Date());
// const [seen, setSeen] = useState(false);
// const [star, setStar] = useState(0);
// const [info, setInfo] = useState();
// const [localArtist, setLocalArtist] = useState(artist);
// const [seasonInfo, setSeasonInfo] = useState();
// const [loading, setLoading] = useState(type === "tv" ? true : false);

// if (loading) {
//   return <div>loading</div>;
// } else {
// return (
//   <>
//     <MediaInfo
//       id={id}
//       title={title}
//       published={published}
//       artist={localArtist}
//       dialogClose={dialogClose}
//       poster={poster}
//     />
//     <CardContent className={classes.metadata}>
//       <Typography variant="h6">
//         <MuiPickersUtilsProvider utils={DayjsUtils}>
//           <KeyboardDatePicker
//             disableToolbar
//             disableFuture
//             variant="inline"
//             format="MM/DD/YYYY"
//             value={date}
//             autoOk={true}
//             onChange={e => (e !== null ? setDate(e.toDate()) : null)}
//             KeyboardButtonProps={{
//               "aria-label": "change date"
//             }}
//           />
//         </MuiPickersUtilsProvider>
//       </Typography>
// <Rating
//   value={star}
//   name="rated"
//   precision={0.5}
//   onChange={(_, newValue: number) => setStar(newValue)}
//   emptyIcon={<IconStar empty fill="#03b021" />}
//   icon={<IconStar fill="#03b021" stroke="#03b021" />}
// />
//       <Box>
//         <Tooltip title="Seen Before?" placement="top">
//           <IconButton onClick={() => setSeen(!seen)}>
//             <IconRepeat stroke={seen ? "blue" : undefined} />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     </CardContent>
//     <Divider />
//     <CardActions className={classes.actions}>
//       <IconButton size="small" onClick={() => mediaSelect()}>
//         <IconChevronLeft />
//       </IconButton>
//       <Button onClick={mediaSet}>Save</Button>
//     </CardActions>
//   </>
// );
// }

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
//     date
//   };
//   if (type === "film") {
//     const filmObj = {
//       ...mediaObj,
//       artist
//     };
//     mediaPutFilm(filmObj);
//   } else if (type === "tv") {
//     const tvObj = {
//       ...mediaObj,
//       id: seasonInfo.id,
//       title: `${title} (${seasonInfo.name})`,
//       artist: info.created_by.map((e: any) => e.name).join(", "),
//       season: seasonInfo.season_number,
//       overview: seasonInfo.overview,
//       published: seasonInfo.air_date,
//       poster: `https://image.tmdb.org/t/p/w400/${seasonInfo.poster_path}`
//     };

//     mediaPutTV(tvObj);
//   } else {
//     const albumObj = {
//       ...mediaObj,
//       artist
//     };
//     mediaPutAlbum(albumObj);
//   }
//   dialogClose();
// }
