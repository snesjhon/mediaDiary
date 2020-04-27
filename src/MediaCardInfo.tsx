import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { IconX } from "./icons";
import { MediaInfo as MediaInfoProps } from "./config/storeMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Divider } from "@material-ui/core";

interface MediaInfoInterface extends MediaInfoProps {
  dialogClose: () => void;
  expanded?: boolean;
}

const useStyles = makeStyles((theme) => ({
  // expandedContainer: {
  //   backdropFilter: "blur(5px)",
  // },
  // expanded: {
  //   width: "100%",
  //   position: "absolute",
  //   top: 0,
  //   height: "100%",
  //   backdropFilter: "blur(5px) brightness(50%)",
  //   color: theme.palette.background.paper,
  //   padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
  //   overflow: "scroll",
  // },
  img: {
    maxWidth: "25vw",
    border: `1px solid ${theme.palette.primary.main}`,
  },
  imgBg: {
    zIndex: -1,
    position: "relative",
    height: "15vh",
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  imgBgFilter: {
    // backdropFilter: "blur(10px)",
    height: "100%",
    width: "100%",
  },
  imgContainer: {
    textAlign: "center",
    marginTop: "-5rem",
  },
}));

function MediaCardInfo({
  title,
  published,
  artist,
  dialogClose,
  poster,
  overview,
  expanded,
  backdrop,
}: MediaInfoInterface) {
  const classes = useStyles();
  debugger;
  return (
    <>
      <Box
        className={classes.imgBg}
        style={{
          backgroundImage: `url(${backdrop !== "" ? backdrop : poster})`,
        }}
      >
        <Box
          className={classes.imgBgFilter}
          style={{
            backdropFilter: `blur(${backdrop !== "" ? 0 : "10px"})`,
          }}
        />
      </Box>
      <Box className={classes.imgContainer}>
        <img className={classes.img} src={poster} />
      </Box>
      <Box px={4} pt={2} textAlign="center">
        <Typography variant="h4">{title}</Typography>
        <Box display="flex" justifyContent="center">
          <Typography variant="subtitle1" color="textSecondary">
            {new Date(published).toLocaleDateString("en-US", {
              year: "numeric",
            })}
          </Typography>
          {artist && (
            <>
              <Box mx={1}>
                <Typography color="textSecondary">·</Typography>
              </Box>
              <Typography variant="subtitle1" color="textSecondary">
                {artist}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box mx={4} py={2}>
        <Divider />
      </Box>
      {/* <CardHeader
        title={title}
        subheader={
          <Box display="flex">
            <Typography variant="subtitle1" color="textSecondary">
              {new Date(published).toLocaleDateString("en-US", {
                year: "numeric",
              })}
            </Typography>
            {artist && (
              <>
                <Box mx={1}>
                  <Typography color="textSecondary">·</Typography>
                </Box>
                <Typography variant="subtitle1" color="textSecondary">
                  {artist}
                </Typography>
              </>
            )}
          </Box>
        }
        action={
          <IconButton onClick={dialogClose}>
            <IconX />
          </IconButton>
        }
      /> */}
      {/* <Box
        className={expanded ? classes.expandedContainer : undefined}
        position="relative"
      >
        <CardMedia component="img" image={poster} title={title} />
        {expanded && (
          <Box className={classes.expanded}>
            <Typography variant="h6" component="div">
              <Box fontWeight={400}>{overview}</Box>
            </Typography>
          </Box>
        )}
      </Box> */}
    </>
  );
}

export default MediaCardInfo;
