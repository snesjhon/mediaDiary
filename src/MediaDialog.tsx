import Card from "@material-ui/core/Card";
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { useState } from "react";
import { MediaListView } from "./MediaList";
import MediaLog from "./MediaLog";
import MediaSearch from "./MediaSearch";
import MediaEdit from "./MediaEdit";

const useStyles = makeStyles(theme => ({
  card: {
    width: theme.breakpoints.values.sm
  },
  cardxs: {
    width: theme.breakpoints.values.sm / 1.5
  }
}));

export type viewType = "edit" | "search" | "log" | "overview";

interface MediaDialogProps {
  listView: MediaListView;
  dialogClose: () => void;
}

function MediaDialog({ listView, dialogClose }: MediaDialogProps) {
  const classes = useStyles();
  const [viewType, setViewType] = useState<viewType>(listView.type);

  return (
    <Dialog open={listView.open} onClose={dialogClose} maxWidth="md">
      <Card className={viewType === "search" ? classes.card : classes.cardxs}>
        {viewType === "search" && (
          <MediaSearch setViewType={setViewType} dialogClose={dialogClose} />
        )}
        {viewType === "log" && <MediaLog dialogClose={dialogClose} />}
        {viewType === "edit" && (
          <MediaEdit listView={listView} dialogClose={dialogClose} />
        )}
      </Card>
    </Dialog>
  );
}

export default MediaDialog;
