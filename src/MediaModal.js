import React, { useState } from "react";
import Modal from "./components/Modal";
import MediaSearch from "./MediaSearch";

const MediaModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return isOpen ? (
    <Modal
      className="markdown-body"
      isOpen={isOpen}
      handleClose={() => setIsOpen(false)}
    >
      <MediaSearch />
    </Modal>
  ) : (
    <div onClick={() => setIsOpen(true)}>opeon</div>
  );
};

export default MediaModal;
