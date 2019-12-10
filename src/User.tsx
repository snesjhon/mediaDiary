/**
 * USER
 * ---
 */
import * as React from "react";
import { useState } from "react";
import { Dropdown, Flex, Icon, Box } from "./components";
import { useStoreActions, useStoreState } from "./config/store";
import { Link } from "react-router-dom";

const User = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const userLogout = useStoreActions(actions => actions.global.userLogout);
  const user = useStoreState(state => state.global.user);
  return (
    <Box position="relative">
      <Box onClick={() => setShowDropdown(!showDropdown)}>
        <img src={(user !== null && user.photoURL) || undefined} width="40px" />
      </Box>
      <Dropdown
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        extend={3}
      >
        <Flex py={2} px={3} alignItems="center">
          <Link to="/profile">
            <Icon
              name="film"
              stroke="var(--primary)"
              height="15px"
              width="15px"
              mr={1}
            />
            Profile
          </Link>
        </Flex>
        <Flex py={2} px={3} alignItems="center" onClick={() => userLogout()}>
          <Icon
            name="tv"
            stroke="var(--primary)"
            height="15px"
            width="15px"
            mr={1}
          />
          Logout
        </Flex>
      </Dropdown>
    </Box>
  );
};

export default User;
