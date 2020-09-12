import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stat,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
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
          <ModalContent maxHeight="60vh">
            <ModalCloseButton />
            <ModalBody pt={6}>
              <Info item={info} />
              <Divider mt={4} mb={2} />
              <Flex justifyContent="space-between">
                <Stat>
                  <StatNumber>
                    {dayjs(diaryDate.toDate()).format("DD/MM")}
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
              <Divider mt={2} mb={2} />
            </ModalBody>
            <ModalFooter py={2} justifyContent="space-between">
              <Button
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
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  }

  return <div>nothing to show</div>;
}
export default EditContent;
