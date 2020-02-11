import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { IconX } from "./icons";
import { MediaInfo as MediaInfoProps } from "./config/storeMedia";

interface MediaInfoInterface extends MediaInfoProps {
  dialogClose: () => void;
}

function MediaInfo({
  title,
  published,
  artist,
  dialogClose,
  poster
}: MediaInfoInterface) {
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
      <CardMedia component="img" image={poster} title={title} />
    </>
  );
}

export default MediaInfo;
