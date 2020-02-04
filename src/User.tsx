/**
 * USER
 * ---
 */
import * as React from "react";
import { useState } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import { Link } from "react-router-dom";

import { Button, Menu, MenuItem, Avatar } from "@material-ui/core";

const User = () => {
  const userLogout = useStoreActions(actions => actions.global.userLogout);
  const user = useStoreState(state => state.global.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar
          alt={(user !== null && user.displayName) || ""}
          src={(user !== null && user.photoURL) || ""}
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
        <MenuItem component={Link} to="/profile" onClick={() => handleClose()}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => userLogout()}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default User;
