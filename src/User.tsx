/**
 * USER
 * ---
 */
import * as React from "react";
import { useState } from "react";
import { Button, Dropdown, Flex, Icon, Box } from "./components";
import { useStoreActions } from "./config/store";

interface UserType {
  user: firebase.User;
}

const User = ({ user }: UserType) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const userVerify = useStoreActions(actions => actions.global.userVerify);
  const userLogout = useStoreActions(actions => actions.global.userLogout);

  return (
    <Box position="relative">
      {user ? (
        <>
          <Button
            variant="image"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={user.photoURL !== null ? user.photoURL : ""}
              width="40px"
            />
          </Button>
          <Dropdown
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            extend={3}
          >
            <Flex py={2} px={3} alignItems="center">
              <Icon
                name="film"
                stroke="var(--primary)"
                height="15px"
                width="15px"
                mr={1}
              />
              Profile
            </Flex>
            <Flex
              py={2}
              px={3}
              alignItems="center"
              onClick={() => userLogout()}
            >
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
        </>
      ) : (
        <div onClick={() => userVerify()}>login</div>
      )}
    </Box>
  );
};

export default User;
