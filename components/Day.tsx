import {
  Collapse,
  Divider,
  Flex,
  HStack,
  IconButton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import { EditIcon, EmailIcon, StarIcon } from "@chakra-ui/icons";
import { useCollection } from "@nandorojo/swr-firestore";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { ContextDispatch } from "../config/store";
import { createMediaState } from "../utils/helpers";
import useUser from "../utils/useUser";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import Info from "./Info";

function Day({ diaryId }: { diaryId: string }) {
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
      !!diaryId
    ) {
      const mediaInfo = mediaState[diaryState[diaryId].id];
      const { overview } = mediaInfo;
      const { rating, diaryDate } = diaryState[diaryId];
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
                    diaryId,
                    diary: diaryState[diaryId],
                    media: mediaInfo,
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
  return <div>Nothing to show</div>;
}

export default Day;
