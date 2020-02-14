import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { IconX } from "./icons";
import { MediaInfo as MediaInfoProps } from "./config/storeMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface MediaInfoInterface extends MediaInfoProps {
  dialogClose: () => void;
  expanded?: boolean;
}

const useStyles = makeStyles(theme => ({
  isBlurred: {
    width: "100%",
    position: "absolute",
    height: "100%",
    backdropFilter: "blur(7px)"
  }
}));

function MediaInfo({
  title,
  published,
  artist,
  dialogClose,
  poster,
  overview,
  expanded
}: MediaInfoInterface) {
  const classes = useStyles();
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
              {artist}
            </Typography>
          </Box>
        }
        action={
          <IconButton onClick={dialogClose}>
            <IconX />
          </IconButton>
        }
      />
      <Box position="relative">
        <CardMedia component="img" image={poster} title={title} />
        {expanded && (
          <>
            <Box className={classes.isBlurred}></Box>
            <Box>{overview}</Box>
          </>
        )}
      </Box>
    </>
  );
}

export default MediaInfo;
