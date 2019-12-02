import * as React from "react";
import { useState } from "react";
import { Box, Modal, Flex, Button, Dropdown, Icon, Text } from "./components";
import MediaSearch from "./MediaSearch";
import MediaLog from "./MediaLog";
import { MediaTypes } from "./config/types";
import { useStoreActions, useStoreState } from "./config/store";

const MediaModal = () => {
  const mediaSelected = useStoreState(state => state.media.mediaSelected);
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const [showDropdown, setShowDropdown] = useState(false);
  const [type, setType] = useState<MediaTypes["type"]>("");
  const isOpen = type !== "";

  const selectType = (type: MediaTypes["type"]) => {
    setShowDropdown(false);
    setType(type);
  };
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="flex-end"
        mr={3}
        borderRight="1px solid var(--border-primary)"
      >
        <Text fontSize={3} mr={3} fontWeight={300} color="blue">
          Add:
        </Text>
        <Icon
          name="film"
          stroke="var(--primary)"
          height="20px"
          width="20px"
          onClick={() => selectType("film")}
          mr={3}
        />
        <Icon
          name="tv"
          stroke="var(--primary)"
          height="20px"
          width="20px"
          onClick={() => selectType("tv")}
          mr={3}
        />
        <Icon
          name="album"
          stroke="var(--primary)"
          height="20px"
          width="20px"
          onClick={() => selectType("album")}
          mr={3}
        />
      </Flex>
      {isOpen && (
        <Modal
          className="markdown-body"
          isOpen={isOpen}
          handleClose={() => {
            setType("");
            mediaSelect();
          }}
        >
          {mediaSelected.id !== "" ? (
            <MediaLog type={type} setType={setType} />
          ) : (
            <MediaSearch type={type} />
          )}
        </Modal>
      )}
    </>
  );
};

export default MediaModal;

// <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown}>
// <Flex
//   py={2}
//   px={3}
//   onClick={() => selectType("film")}
//   alignItems="center"
// >
//   <Icon
//     name="film"
//     stroke="var(--primary)"
//     height="15px"
//     width="15px"
//     mr={1}
//   />
//   Film
// </Flex>
// <Flex
//   py={2}
//   px={3}
//   onClick={() => selectType("tv")}
//   alignItems="center"
// >
//   <Icon
//     name="tv"
//     stroke="var(--primary)"
//     height="15px"
//     width="15px"
//     mr={1}
//   />
//   TV
// </Flex>
// <Flex
//   py={2}
//   px={3}
//   onClick={() => selectType("album")}
//   alignItems="center"
// >
//   <Icon
//     name="album"
//     stroke="var(--primary)"
//     height="15px"
//     width="15px"
//     mr={1}
//   />
//   Album
// </Flex>
// </Dropdown>
