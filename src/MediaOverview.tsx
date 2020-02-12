import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useStoreState } from "./config/store";
import MediaInfo from "./MediaInfo";
import { MediaListView } from "./MediaList";

interface MediaOverviewProps {
  listView: MediaListView;
  dialogClose: () => void;
}

function MediaOverview({ listView, dialogClose }: MediaOverviewProps) {
  const byDate = useStoreState(state => state.data.byDate);
  const byID = useStoreState(state => state.data.byID);
  const { mediaID } = listView;
  const { id } = byDate[typeof mediaID !== "undefined" ? mediaID : ""];
  const { artist, overview, poster, title, published } = byID[id];

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
      <CardActions>
        <Button>Edit</Button>
      </CardActions>
      <Divider />
      <CardContent>{overview}</CardContent>
    </>
  );
}

export default MediaOverview;
