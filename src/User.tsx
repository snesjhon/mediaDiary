/**
 * USER
 * ---
 */
import * as React from "react";
import { useState } from "react";
// import { Dropdown, Flex, Icon, Box } from "./components";
import { useStoreActions, useStoreState } from "./config/store";
import { Link } from "react-router-dom";
// import Button from "@material-ui/core/Button";

import { Button, Menu, MenuItem, Avatar } from "@material-ui/core";

const User = () => {
  // const [showDropdown, setShowDropdown] = useState(false);

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
        <Avatar alt="USER NAME" src={(user !== null && user.photoURL) || ""} />
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
// <Box onClick={() => setShowDropdown(!showDropdown)}>
//   <Avatar alt="Remy Sharp" src={(user !== null && user.photoURL) || ""} />
// </Box>
// <Dropdown
//   showDropdown={showDropdown}
//   setShowDropdown={setShowDropdown}
//   extend={3}
// >
//   <Flex py={2} px={3} alignItems="center">
//     <Link to="/profile">
//       <Icon
//         name="film"
//         stroke="primary"
//         height="15px"
//         width="15px"
//         mr={1}
//       />
//       Profile
//     </Link>
//   </Flex>
//   <Flex py={2} px={3} alignItems="center" onClick={() => userLogout()}>
//     <Icon name="tv" stroke="primary" height="15px" width="15px" mr={1} />
//     Logout
//   </Flex>
// </Dropdown>
