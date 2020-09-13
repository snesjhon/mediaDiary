import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatNumber,
  useDisclosure,
  Text,
} from "@chakra-ui/core";
import { EditIcon, EmailIcon, StarIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
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

  // const [showOverview, setShowOverview] = useState();

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
            <Box position="absolute" top={2} left={2}>
              <IconButton
                icon={<EditIcon boxSize={4} />}
                aria-label="edit"
                variant="ghost"
                size="sm"
              />
            </Box>
            <ModalBody pt={6}>
              <Info item={info} />
              <Divider mt={4} mb={2} />
              <Flex justifyContent="space-between">
                <Stat>
                  <StatNumber>
                    {dayjs(diaryDate.toDate()).format("MM/DD")}
                  </StatNumber>
                  <StatHelpText>Date</StatHelpText>
                </Stat>
                <Stat>
                  <StatNumber>
                    <Rating
                      fractions={2}
                      readonly
                      initialRating={rating}
                      fullSymbol={<StarIcon color="purple.400" />}
                      emptySymbol={<StarEmptyIcon stroke="purple.400" />}
                    />
                  </StatNumber>
                  <StatHelpText textAlign="right">Rating</StatHelpText>
                </Stat>
              </Flex>
              <Divider mt={2} mb={4} />
              {overview && (
                <>
                  <Button
                    colorScheme="purple"
                    onClick={onToggle}
                    size="sm"
                    variant="outline"
                    leftIcon={<EmailIcon />}
                    mb={4}
                  >
                    Overview
                  </Button>
                  <Collapse isOpen={isOpen}>
                    <Text fontSize="sm" mb={4}>
                      {overview}
                    </Text>
                  </Collapse>
                </>
              )}
            </ModalBody>
            {/* <ModalFooter py={2} justifyContent="space-between">
              <IconButton
                icon={<EditIcon />}
                aria-label="edit"
                // variant="outline"
                size="sm"
              />
              {/* <Button
                // onClick={addData}
                // isLoading={isLoading}
                colorScheme="red"
                size="sm"
              >
                Delete
              </Button>
              <Button
                // onClick={addData}
                // isLoading={isLoading}
                colorScheme="green"
                size="sm"
              >
                Edit
              </Button> */}
            {/* </ModalFooter> */}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  }

  return <div>nothing to show</div>;
}
export default EditContent;
