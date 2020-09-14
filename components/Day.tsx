import {
  HStack,
  IconButton,
  Divider,
  Flex,
  Stat,
  StatNumber,
  StatHelpText,
  Collapse,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { EmailIcon, EditIcon, StarIcon } from "@chakra-ui/icons";
import { useCollection } from "@nandorojo/swr-firestore";
import { info } from "console";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { ContextDispatch } from "../config/store";
import { createMediaState } from "../utils/helpers";
import useUser from "../utils/useUser";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import Info from "./Info";
function Day({ item }: { item: string }) {
  const { user } = useUser();
  const dispatch = useContext(ContextDispatch);
  const { data } = useCollection(user.email);
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  if (data) {
    const { diaryState, mediaState } = createMediaState(data);

    if (
      Object.keys(diaryState).length > 0 &&
      Object.keys(mediaState).length > 0 &&
      !!item
    ) {
      const mediaInfo = mediaState[diaryState[item].id];
      const { overview } = mediaInfo;
      const { rating, diaryDate } = diaryState[item];
      return (
        <>
          <Info item={mediaInfo} />
          <HStack spacing={2} justify="center" mt={2}>
            {overview && (
              <>
                <IconButton
                  variant="outline"
                  colorScheme="blue"
                  aria-label="Show Overview"
                  size="sm"
                  icon={<EmailIcon />}
                  onClick={onToggle}
                  isRound
                />
              </>
            )}
            <IconButton
              icon={<EditIcon />}
              aria-label="edit"
              variant="outline"
              size="sm"
              colorScheme="green"
              isRound
              onClick={() => {
                dispatch({
                  type: "edit",
                  payload: {
                    itemId: item,
                    info: mediaInfo,
                    item: diaryState[item],
                  },
                });
                router.push("/?view=edit", "/edit", {
                  shallow: true,
                });
              }}
            />
          </HStack>
          <Divider mt={3} mb={2} />
          <Flex justifyContent="space-between">
            <Stat>
              <StatNumber>
                {dayjs(diaryDate.toDate()).format("MMM D, YYYY")}
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
          <Collapse isOpen={isOpen}>
            <Text fontSize="sm" mb={4}>
              {overview}
            </Text>
          </Collapse>
        </>
      );
    }
  }
  return (
    <>
      <div>asd2</div>
      {/* <Info item={info} />
      <HStack spacing={2} justify="center" mt={2}>
        {overview && (
          <>
            <IconButton
              variant="outline"
              colorScheme="blue"
              aria-label="Show Overview"
              size="sm"
              icon={<EmailIcon />}
              onClick={onToggle}
              isRound
            />
          </>
        )}
        <IconButton
          icon={<EditIcon />}
          aria-label="edit"
          variant="outline"
          size="sm"
          colorScheme="green"
          isRound
        />
      </HStack>
      <Divider mt={3} mb={2} />
      <Flex justifyContent="space-between">
        <Stat>
          <StatNumber>
            {dayjs(diaryDate.toDate()).format("MMM D, YYYY")}
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
      <Collapse isOpen={isOpen}>
        <Text fontSize="sm" mb={4}>
          {overview}
        </Text>
      </Collapse> */}
    </>
  );
}

export default Day;
