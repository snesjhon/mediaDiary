import * as React from "react";
import { useState } from "react";
import { Box, Modal, Flex, Button, Dropdown, Icon, Text } from "./components";
import MediaSearch from "./MediaSearch";
import MediaLog from "./MediaLog";
import { MediaTypes } from "./config/storeMedia";
import { useStoreActions, useStoreState } from "./config/store";

const MediaAdd = () => {
  const mediaSelected = useStoreState(state => state.media.mediaSelected);
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const [type, setType] = useState<MediaTypes["type"]>("");
  const isOpen = type !== "";
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
          stroke="primary"
          height="20px"
          width="20px"
          onClick={() => setType("film")}
          mr={3}
        />
        <Icon
          name="tv"
          stroke="primary"
          height="20px"
          width="20px"
          onClick={() => setType("tv")}
          mr={3}
        />
        <Icon
          name="album"
          stroke="primary"
          height="20px"
          width="20px"
          onClick={() => setType("album")}
          mr={3}
        />
      </Flex>
      {isOpen && (
        <Modal
          className="markdown-body"
          width={["85vw", "80vw", "60vw", "40vw"]}
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

export default MediaAdd;
