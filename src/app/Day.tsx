import * as React from "react";
import { MDDispatchCtx, MDStateCtx } from "./MediaDiary";
import { useStoreState } from "../store/store";
import { Typography, IconButton } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { IconStar, IconText, IconRepeat } from "../icons";

function Day() {
  const byID = useStoreState((state) => state.data.byID);
  const dispatchMedia = React.useContext(MDDispatchCtx);
  const { day } = React.useContext(MDStateCtx);
  const date = day?.date;
  const star = day?.star;
  const seen = day?.seen;

  // day
  // let artist, poster, backdrop, published, title, type;
  // if (viewType === "day" && typeof day?.id !== "undefined") {

  //   // const daySelected = byID[day.id];
  // }

  return (
    <>
      {typeof date !== "undefined" && (
        <Typography variant="h6">
          {new Date(date.toDate()).toLocaleDateString("en-us", {
            month: "short",
            day: "numeric",
          })}
        </Typography>
      )}
      <Rating
        name="half-rating"
        value={star}
        precision={0.5}
        readOnly
        emptyIcon={<IconStar empty fill="#03b021" />}
        icon={<IconStar fill="#03b021" stroke="#03b021" />}
      />
      {/* {overview !== "" && (
        <IconButton
          className={expanded ? classes.itemActive : ""}
          onClick={() => dispatch({ type: "expanded", payload: !expanded })}
        >
          <IconText />
        </IconButton>
      )} */}
      {seen && (
        <IconButton>
          <IconRepeat stroke={seen ? "blue" : undefined} />
        </IconButton>
      )}
    </>
  );
}

export default Day;
