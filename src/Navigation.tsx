import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconLogo from "./icons/IconLogo";
import IconMenu from "./icons/IconMenu";
import IconSettings from "./icons/IconSettings";
import * as React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "./config/store";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { MediaListProp } from "./Main";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 9,
  },
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  divider: {
    color: theme.palette.grey["300"],
    marginRight: theme.spacing(1),
  },
  navColors: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    // backgroundColor: theme.palette.background.default,
    backgroundColor: "#F0F0F0",
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

function Navigation({ openDrawer, setOpenDrawer }: MediaListProp) {
  const year = useStoreState((state) =>
    state.global.preferences.year !== null ? state.global.preferences.year : ""
  );
  const userLogout = useStoreActions((actions) => actions.global.userLogout);
  const user = useStoreState((state) => state.global.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <AppBar
        className={classes.navColors}
        position="static"
        variant="outlined"
      >
        <Toolbar variant="dense" disableGutters={true}>
          <IconButton size="small" onClick={() => setOpenDrawer(!openDrawer)}>
            <IconMenu />
          </IconButton>
          <Box className={classes.title}>
            <Box pl={2}>
              <IconLogo width={20} />
            </Box>
            <Box
              pl={1}
              // component="span"
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
      </AppBar>
    </Box>
  );
}

export default Navigation;
