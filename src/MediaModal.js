import React, { useState } from "react";
import Modal from "./components/Modal";
import MediaSearch from "./MediaSearch";
import MediaLog from "./MediaLog";

const MediaModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [type, setType] = useState("film");

  return isOpen ? (
    <Modal
      className="markdown-body"
      isOpen={isOpen}
      handleClose={() => {
        setIsOpen(false);
        setSelected({});
      }}
    >
      {Object.keys(selected).length > 0 ? (
        <MediaLog selected={selected} type={type} />
      ) : (
        <MediaSearch setSelected={setSelected} setType={setType} type={type} />
      )}
    </Modal>
  ) : (
    <div onClick={() => setIsOpen(true)}>opeon</div>
  );
};

export default MediaModal;
