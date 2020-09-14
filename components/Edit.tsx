import {
  Collapse,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { EditIcon, EmailIcon, StarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { ContextState } from "../config/store";
import useUser from "../utils/useUser";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import Info from "./Info";

function EditContent() {
  const { user, logout } = useUser();
  const { edit } = useContext(ContextState);
  const router = useRouter();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  if (typeof edit !== "undefined") {
    const { info, item } = edit;
    const { rating, diaryDate } = item;
    const { overview } = info;
    return (
      <Modal
        isOpen={true}
        onClose={() => router.push("/")}
        scrollBehavior="inside"
        size="sm"
        trapFocus={false}
      >
        <ModalOverlay px={4}>
          <ModalContent>
            <ModalCloseButton />
            <ModalBody pt={6}>
              <Info item={info} />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  }

  return <div>nothing to show</div>;
}
export default EditContent;
