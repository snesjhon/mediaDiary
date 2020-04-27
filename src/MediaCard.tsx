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
} from "@material-ui/pickers";
import * as firebase from "firebase/app";
import * as React from "react";
import { useReducer } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import { IconChevronLeft, IconRepeat, IconStar, IconText } from "./icons";
import MediaCardInfo from "./MediaCardInfo";
import { MediaListView } from "./MediaList";
import { createPosterURL } from "./utilities/helpers";

const useStyles = makeStyles((theme) => ({
  metadata: {
    display: "grid",
    gridTemplateColumns: "1fr 0.5fr 0.3fr",
    alignItems: "center",
    gridGap: "1.5rem",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemActive: {
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

interface StateType {
  expanded?: boolean;
  editing?: boolean;
  localDate: firebase.firestore.Timestamp;
  localSeen: boolean;
  localStar: number;
}

type ActionType = {
  type:
    | "expanded"
    | "editing"
    | "setLocalDate"
    | "setLocalSeen"
    | "setLocalStar";
  payload?: any;
};

const MediaEditReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "expanded": {
      return {
        ...state,
        expanded: action.payload,
      };
    }
    case "editing": {
      return {
        ...state,
        editing: action.payload,
      };
    }
    case "setLocalDate": {
      return {
        ...state,
        localDate: action.payload,
      };
    }
    case "setLocalSeen": {
      return {
        ...state,
        localSeen: action.payload,
      };
    }
    case "setLocalStar": {
      return {
        ...state,
        localStar: action.payload,
      };
    }
    default:
      return state;
  }
};
interface MediaCardProps {
  listView: MediaListView;
  dialogClose: () => void;
}

function MediaCard({ listView, dialogClose }: MediaCardProps) {
  const byDate = useStoreState((state) => state.data.byDate);
  const byID = useStoreState((state) => state.data.byID);

  const { mediaID, showOverview, showEdit } = listView;
  const { id, seen, star, date, type } = byDate[
    typeof mediaID !== "undefined" ? mediaID : ""
  ];
  const { artist, overview, poster, title, season, published } = byID[id];

  const [
    { expanded, editing, localDate, localSeen, localStar },
    dispatch,
  ] = useReducer(MediaEditReducer, {
    expanded: showOverview,
    editing: showEdit,
    localDate: date,
    localStar: star,
    localSeen: seen,
  });

  const localPoster = createPosterURL({
    type,
    poster,
  });

  return (
    <>
      <MediaCardInfo
        id={id}
        title={title}
        published={published}
        artist={artist}
        dialogClose={dialogClose}
        poster={localPoster}
        expanded={expanded}
        overview={overview}
      />
      {!editing && (
        <MediaInfo
          listView={listView}
          dialogClose={dialogClose}
          dispatch={dispatch}
          expanded={expanded}
        />
      )}
      {editing && (
        <MediaEdit
          listView={listView}
          dialogClose={dialogClose}
          dispatch={dispatch}
          localDate={localDate}
          localSeen={localSeen}
          localStar={localStar}
        />
      )}
    </>
  );
}

interface MediaInfoProps extends MediaCardProps {
  dispatch: React.Dispatch<ActionType>;
  expanded: boolean;
}

function MediaInfo({
  listView,
  dialogClose,
  dispatch,
  expanded,
}: MediaInfoProps) {
  const byDate = useStoreState((state) => state.data.byDate);
  const byID = useStoreState((state) => state.data.byID);
  const dataDelete = useStoreActions((actions) => actions.data.dataDelete);

  const { mediaID } = listView;
  const { id, seen, star, date } = byDate[
    typeof mediaID !== "undefined" ? mediaID : ""
  ];
  const { overview } = byID[id];
  const classes = useStyles();
  return (
    <>
      <CardContent className={classes.actions}>
        <Typography variant="h6">
          {new Date(date.toDate()).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
          })}
        </Typography>
        <Rating
          name="half-rating"
          value={star}
          precision={0.5}
          readOnly
          emptyIcon={<IconStar empty fill="#03b021" />}
          icon={<IconStar fill="#03b021" stroke="#03b021" />}
        />
        {overview !== "" && (
          <IconButton
            className={expanded ? classes.itemActive : ""}
            onClick={() => dispatch({ type: "expanded", payload: !expanded })}
          >
            <IconText />
          </IconButton>
        )}
        {seen && (
          <IconButton>
            <IconRepeat stroke={seen ? "blue" : undefined} />
          </IconButton>
        )}
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          size="small"
          onClick={() => {
            if (typeof mediaID !== "undefined") {
              return dataDelete({
                mediaID,
                cb: () => dialogClose(),
              });
            }
          }}
        >
          Delete
        </Button>
        <Button
          size="small"
          onClick={() => dispatch({ type: "editing", payload: true })}
        >
          Edit
        </Button>
      </CardActions>
    </>
  );
}

interface MediaEditProps extends MediaCardProps, StateType {
  dispatch: React.Dispatch<ActionType>;
}

function MediaEdit({
  listView,
  localDate,
  localSeen,
  localStar,
  dispatch,
  dialogClose,
}: MediaEditProps) {
  const mediaUpdate = useStoreActions((actions) => actions.data.dataUpdate);
  const dataDelete = useStoreActions((actions) => actions.data.dataDelete);
  const { mediaID } = listView;
  const classes = useStyles();
  return (
    <>
      <CardContent className={classes.metadata}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <KeyboardDatePicker
            disableToolbar
            disableFuture
            variant="inline"
            format="MM/DD/YYYY"
            value={localDate.toDate()}
            autoOk={true}
            onChange={(e) => {
              return e !== null
                ? dispatch({
                    type: "setLocalDate",
                    payload: firebase.firestore.Timestamp.fromDate(e.toDate()),
                  })
                : null;
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <Rating
          value={localStar}
          name="rated"
          precision={0.5}
          onChange={(_, newValue: number) =>
            dispatch({ type: "setLocalStar", payload: newValue })
          }
          emptyIcon={<IconStar empty fill="#03b021" />}
          icon={<IconStar fill="#03b021" stroke="#03b021" />}
        />
        <Box>
          <Tooltip title="Seen Before?" placement="top">
            <IconButton
              onClick={() =>
                dispatch({ type: "setLocalSeen", payload: !localSeen })
              }
            >
              <IconRepeat stroke={localSeen ? "blue" : undefined} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <IconButton
          size="small"
          onClick={() => dispatch({ type: "editing", payload: false })}
        >
          <IconChevronLeft />
        </IconButton>
        <Button
          size="small"
          onClick={() => {
            if (typeof mediaID !== "undefined") {
              return dataDelete({
                mediaID,
                cb: () => dialogClose(),
              });
            }
          }}
        >
          Delete
        </Button>
        <Button size="small" onClick={handleMediaUpdate}>
          Save
        </Button>
      </CardActions>
    </>
  );

  function handleMediaUpdate() {
    if (typeof mediaID !== "undefined") {
      return mediaUpdate({
        dayID: mediaID,
        modifiedDate: localDate,
        modifiedSeen: localSeen,
        modifiedStar: localStar,
        cb: () => dialogClose(),
      });
    }
  }
}

export default MediaCard;
