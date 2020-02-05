import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { IconStar, IconX, IconChevronLeft, IconRepeat } from "./icons";
import Rating from "@material-ui/lab/Rating/Rating";
import * as React from "react";
import { useEffect, useState } from "react";
import { MBDKEY, MDBURL } from "./config/constants";
import { useStoreActions, useStoreState } from "./config/store";
import { MediaTypes } from "./config/storeMedia";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

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
interface MediaLogProps extends MediaTypes {
  setType: React.Dispatch<React.SetStateAction<string>>;
  closeDialog: () => void;
}

const MediaLog = ({ type, setType, closeDialog }: MediaLogProps) => {
  const classes = useStyles();
  const {
    id,
    artist,
    overview,
    poster,
    published,
    title,
    watched
  } = useStoreState(state => state.media.mediaSelected);
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const mediaPutFilm = useStoreActions(actions => actions.media.mediaPutFilm);
  const mediaPutTV = useStoreActions(actions => actions.media.mediaPutTV);
  const mediaPutAlbum = useStoreActions(actions => actions.media.mediaPutAlbum);
  const [date, setDate] = useState(new Date());
  const [seen, setSeen] = useState(false);
  const [star, setStar] = useState(0);
  const [info, setInfo] = useState();
  const [localArtist, setLocalArtist] = useState(artist);
  const [seasonInfo, setSeasonInfo] = useState();
  const [loading, setLoading] = useState(type === "tv" ? true : false);

  useEffect(() => {
    if (type === "tv") {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${MBDKEY}&language=en-US`
      )
        .then(r => r.json())
        .then(info => {
          setInfo(info);
          setSeasonInfo(info.seasons[0]);
          setLoading(false);
        });
    } else if (type === "film") {
      fetch(
        `${MDBURL}/movie/${encodeURIComponent(id)}/credits?api_key=${MBDKEY}`
      )
        .then(r => r.json())
        .then(credits => {
          setLocalArtist(
            credits.crew.find((e: any) => e.job === "Director").name
          );
          setLoading(false);
        });
    }
  }, [type, id]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <>
        <CardHeader
          title={title}
          subheader={
            <Box display="flex">
              <Typography variant="subtitle1" color="textSecondary">
                {new Date(published).toLocaleDateString("en-US", {
                  year: "numeric"
                })}
              </Typography>
              <Box mx={1}>
                <Typography color="textSecondary">·</Typography>
              </Box>
              <Typography variant="subtitle1" color="textSecondary">
                {localArtist}
              </Typography>
            </Box>
          }
          action={
            <IconButton onClick={closeDialog}>
              <IconX onClick={closeDialog} />
            </IconButton>
          }
        />
        <CardMedia component="img" image={poster} title={title} />
        <CardContent className={classes.metadata}>
          <Typography variant="h6">
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                variant="inline"
                format="MM/DD/YYYY"
                value={date}
                autoOk={true}
                onChange={e => (e !== null ? setDate(e.toDate()) : null)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </MuiPickersUtilsProvider>
          </Typography>
          <Rating
            value={star}
            name="rated"
            precision={0.5}
            onChange={(_, newValue: number) => setStar(newValue)}
            emptyIcon={<IconStar empty fill="#03b021" />}
            icon={<IconStar fill="#03b021" stroke="#03b021" />}
          />
          <Box>
            <Tooltip title="Seen Before?" placement="top">
              <IconButton>
                <IconRepeat />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
        <Divider />
        <CardActions className={classes.actions}>
          <IconButton size="small" onClick={() => mediaSelect()}>
            <IconChevronLeft />
          </IconButton>
          <Button onClick={mediaSet}>Save</Button>
        </CardActions>
      </>
    );
  }

  function mediaSet() {
    const mediaObj = {
      type,
      id,
      overview,
      poster,
      published,
      title,
      seen,
      star,
      date
    };
    if (type === "film") {
      const filmObj = {
        ...mediaObj,
        artist
      };
      mediaPutFilm(filmObj);
    } else if (type === "tv") {
      const tvObj = {
        ...mediaObj,
        id: seasonInfo.id,
        title: `${title} (${seasonInfo.name})`,
        artist: info.created_by.map((e: any) => e.name).join(", "),
        season: seasonInfo.season_number,
        overview: seasonInfo.overview,
        published: seasonInfo.air_date,
        poster: `https://image.tmdb.org/t/p/w400/${seasonInfo.poster_path}`
      };

      mediaPutTV(tvObj);
    } else {
      const albumObj = {
        ...mediaObj,
        artist
      };
      mediaPutAlbum(albumObj);
    }
    setType("");
  }
};

export default MediaLog;
