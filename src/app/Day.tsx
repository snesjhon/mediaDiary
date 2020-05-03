import * as React from "react";
import { MDDispatchCtx, MDStateCtx } from "./MediaDiary";
import { useStoreState, useStoreActions } from "../store/store";
import {
  Typography,
  IconButton,
  Box,
  Divider,
  Button,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { IconStar, IconText, IconRepeat, IconPlus } from "../icons";
import { useState } from "react";

function Day() {
  const [showOverview, setShowOverview] = useState(false);
  const byID = useStoreState((state) => state.data.byID);
  const dispatchMedia = React.useContext(MDDispatchCtx);
  const dataDelete = useStoreActions((actions) => actions.data.dataDelete);
  const { day } = React.useContext(MDStateCtx);

  if (typeof day !== "undefined") {
    const id = day?.id;
    const date = day?.date;
    const star = day?.star;
    const seen = day?.seen;
    const mediaID = day?.mediaID;

    const { overview } = byID[id];

    return (
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Date</Typography>
          {typeof date !== "undefined" && (
            <Typography variant="h6">
              <Box fontWeight={400}>
                {new Date(date.toDate()).toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                })}
              </Box>
            </Typography>
          )}
        </Box>
        <Box py={2}>
          <Divider />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Rate</Typography>
          <Rating
            name="half-rating"
            value={star}
            precision={0.5}
            readOnly
            emptyIcon={<IconStar empty fill="#03b021" />}
            icon={<IconStar fill="#03b021" stroke="#03b021" />}
          />
        </Box>
        <Box py={2}>
          <Divider />
        </Box>
        {seen && (
          <IconButton>
            <IconRepeat stroke={seen ? "blue" : undefined} />
          </IconButton>
        )}

        {overview && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Overview</Typography>
              <IconButton
                size="small"
                onClick={() => setShowOverview(!showOverview)}
              >
                <IconPlus />
              </IconButton>
              {/* <Typography>
              <Box fontWeight={400}>{overview}</Box>
            </Typography> */}
            </Box>
            {showOverview && (
              <Box py={2}>
                <Typography>
                  <Box fontWeight={400}>{overview}</Box>
                </Typography>
              </Box>
            )}
            <Box py={2}>
              <Divider />
            </Box>
          </>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            size="small"
            color="primary"
            variant="contained"
            disableElevation={true}
            onClick={() => {
              return dataDelete({
                mediaID,
                cb: () =>
                  dispatchMedia({
                    type: "view",
                    payload: {
                      view: "media",
                    },
                  }),
              });
            }}
          >
            Delete
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            disableElevation={true}
            // onClick={() => dispatch({ type: "editing", payload: true })}
          >
            Edit
          </Button>
        </Box>
      </>
    );
  } else {
    return <div>nothing to show</div>;
  }
}

export default Day;
