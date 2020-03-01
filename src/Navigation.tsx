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
import * as React from "react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "./config/store";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  divider: {
    color: theme.palette.grey["300"],
    marginRight: theme.spacing(1)
  },
  navColors: {
    backgroundColor: theme.palette.background.default
  },
  linkColor: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold
  },
  year: {
    color: theme.palette.secondary.main
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

function Navigation() {
  const year = useStoreState(state =>
    state.global.preferences.year !== null ? state.global.preferences.year : ""
  );
  const userLogout = useStoreActions(actions => actions.global.userLogout);
  const user = useStoreState(state => state.global.user);
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
        <Box px={2}>
          <Toolbar variant="dense" disableGutters={true}>
            <Link
              className={classes.linkColor}
              variant="h6"
              component={RouterLink}
              to="/"
            >
              MediaDiary
            </Link>
            <Box display="flex" pl={1} flexGrow={1}>
              <Typography className={classes.divider} variant="h6">
                /
              </Typography>
              <Typography className={classes.year} variant="h6">
                {" "}
                {year}
              </Typography>
            </Box>

            <Button
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <Avatar
                className={classes.avatar}
                alt={(user !== null && user.displayName) || ""}
                src={(user !== null && user.photoURL + "=s50-c") || ""}
              />
            </Button>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <MenuItem
                component={RouterLink}
                to="/profile"
                onClick={() => handleClose()}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={() => userLogout()}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </Box>
      </AppBar>
    </Box>
  );
}

export default Navigation;
