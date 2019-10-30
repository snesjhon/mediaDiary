import React, { useState } from "react";
import { Box, Modal, Flex, Button, Dropdown, Icon } from "./components";
import MediaSearch from "./MediaSearch";
import MediaLog from "./MediaLog";

const MediaModal = () => {
  const [selected, setSelected] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState("");
  const isOpen = type !== "";

  const selectType = type => {
    setShowDropdown(false);
    setType(type);
  };
  return (
    <>
      <Box position="relative">
        <Button
          variant="primary"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          + Log
        </Button>
        <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown}>
          <Flex
            py={2}
            px={3}
            onClick={() => selectType("film")}
            alignItems="center"
          >
            <Icon
              name="film"
              stroke="var(--primary)"
              height="15px"
              width="15px"
              mr={1}
            />
            Film
          </Flex>
          <Flex
            py={2}
            px={3}
            onClick={() => selectType("tv")}
            alignItems="center"
          >
            <Icon
              name="tv"
              stroke="var(--primary)"
              height="15px"
              width="15px"
              mr={1}
            />
            TV
          </Flex>
          <Flex
            py={2}
            px={3}
            onClick={() => selectType("album")}
            alignItems="center"
          >
            <Icon
              name="album"
              stroke="var(--primary)"
              height="15px"
              width="15px"
              mr={1}
            />
            Album
          </Flex>
        </Dropdown>
      </Box>
      {isOpen && (
        <Modal
          className="markdown-body"
          isOpen={isOpen}
          handleClose={() => {
            setType("");
            setSelected({});
          }}
        >
          {Object.keys(selected).length > 0 ? (
            <MediaLog
              selected={selected}
              type={type}
              setSelected={setSelected}
            />
          ) : (
            <MediaSearch
              setSelected={setSelected}
              setType={setType}
              type={type}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default MediaModal;
