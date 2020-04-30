import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import IconLogo from "../icons/IconLogo";
import IconMenu from "../icons/IconMenu";
import IconSettings from "../icons/IconSettings";
import { Hidden, SwipeableDrawer } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  toolbarPad: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  divider: {
    color: theme.palette.grey["300"],
    marginRight: theme.spacing(1),
  },
  linkColor: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
  year: {
    color: theme.palette.secondary.main,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

function Navigation({}: // dispatchMedia,
{
  // dispatchMedia: React.Dispatch<MediaActions>;
}) {
  const classes = useStyles();
  const [drawer, setDrawer] = useState(false);

  return (
    <>
      <Toolbar
        className={classes.toolbarPad}
        variant="dense"
        disableGutters={true}
      >
        <IconButton
          size="small"
          onClick={() =>
            // dispatchMedia({ type: "drawer", payload: !openDrawer })
            setDrawer(!drawer)
          }
        >
          <IconMenu />
        </IconButton>
        <Box className={classes.title}>
          <Box pl={2}>
            <IconLogo width={20} />
          </Box>
          <Box
            pl={1}
            color="#592ABC"
            fontSize="body1.fontSize"
            fontWeight="600"
          >
            mediaDiary
          </Box>
        </Box>
        <IconButton size="small">
          <IconSettings />
        </IconButton>
      </Toolbar>
      <Hidden smUp>
        <SwipeableDrawer
          anchor="left"
          variant="temporary"
          open={drawer}
          onClose={() => setDrawer(false)}
          onOpen={() => setDrawer(true)}
          disableDiscovery={true}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div>asd</div>
        </SwipeableDrawer>
      </Hidden>
    </>
  );
}

export default Navigation;
