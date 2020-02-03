import * as React from "react";
import { useState, useEffect } from "react";
import { MBDKEY, MDBURL } from "./config/constants";
// import { Box, Grid, Text, Button, Flex, Icon, Image } from "./components";
// import styled from "styled-components";
// import DatePicker from "react-date-picker";
import { MediaTypes } from "./config/storeMedia";
import { useStoreState, useStoreActions } from "./config/store";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import CardActions from "@material-ui/core/CardActions";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating/Rating";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditOutlined from "@material-ui/icons/EditOutlined";
// @ts-ignore
// import ReactStars from "react-stars";

// const PosterImg = styled(Image)`
//   box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35);
// `;

const useStyles = makeStyles(theme => ({
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh"
  }
}));
interface MediaLogProps extends MediaTypes {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const MediaLog = ({ type, setType }: MediaLogProps) => {
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
            localArtist
              ? localArtist +
                `(${new Date(published).toLocaleDateString("en-us", {
                  year: "numeric"
                })})`
              : `(${new Date(published).toLocaleDateString("en-us", {
                  year: "numeric"
                })})`
          }
        />
        <CardMedia component="img" image={poster} title={title} />
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
                {date.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric"
                })}
              </Typography>
            </Box>
            <Rating
              // value={star}
              value={star}
              name="rated"
              precision={0.5}
              size="small"
              readOnly
              emptyIcon={<StarBorderIcon fontSize="small" />}
              icon={<StarIcon fontSize="small" color="primary" />}
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <IconButton>
              <EditOutlined />
            </IconButton>
          </Box>
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
