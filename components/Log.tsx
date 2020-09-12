import React, { useContext, useReducer } from "react";
import { ContextState } from "../config/store";
import {
  Box,
  Center,
  Image,
  Flex,
  Text,
  Divider,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Checkbox,
  Input,
} from "@chakra-ui/core";
import { fuego } from "@nandorojo/swr-firestore";
import useUser from "../utils/useUser";
import { MediaDiaryAdd, MediaInfoAdd } from "../config/mediaTypes";
import { useRouter } from "next/router";
import Rating from "react-rating";
import { StarIcon } from "@chakra-ui/icons";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import dayjs from "dayjs";
import Info from "./Info";

interface State {
  isLoading: boolean;
  diaryDate: Date;
  loggedBefore: boolean;
  rating: number;
  season: any;
  episode: number;
  seasons?: any;
}

type Actions = {
  type: "state";
  payload: {
    key: keyof State;
    value: any;
  };
};

function Reducer(state: State, actions: Actions): State {
  switch (actions.type) {
    case "state":
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    default:
      return state;
  }
}

function Log() {
  const [
    { diaryDate, loggedBefore, rating, season, episode, seasons, isLoading },
    dispatch,
  ] = useReducer(Reducer, {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    season: {},
    episode: 1,
    seasons: {},
    isLoading: false,
  });
  const { selected } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();

  return (
    <Modal
      isOpen={true}
      onClose={() => router.push("/")}
      scrollBehavior="inside"
      size="sm"
      trapFocus={false}
    >
      <ModalOverlay>
        <ModalContent maxHeight="80vh">
          <ModalCloseButton />
          <ModalBody pt={6}>
            <Info item={selected as MediaInfoAdd} />
            <Divider mt={4} mb={2} />
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Date</Text>
              <Box>
                <Input
                  type="date"
                  required
                  value={dayjs(diaryDate).format("YYYY-MM-DD")}
                  max={dayjs().format("YYYY-MM-DD")}
                  onChange={(e) =>
                    dispatch({
                      type: "state",
                      payload: {
                        key: "diaryDate",
                        value: dayjs(e.target.value).toDate(),
                      },
                    })
                  }
                />
              </Box>
            </Flex>
            <Divider my={2} />
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Rate</Text>
              <Box mt="-4px">
                <Rating
                  fractions={2}
                  initialRating={rating}
                  fullSymbol={<StarIcon h="20px" w="20px" color="purple.500" />}
                  emptySymbol={
                    <StarEmptyIcon h="20px" w="20px" stroke="purple.500" />
                  }
                  onChange={(value) =>
                    dispatch({
                      type: "state",
                      payload: {
                        key: "rating",
                        value,
                      },
                    })
                  }
                />
              </Box>
            </Flex>
            <Divider my={2} />
            <Flex alignItems="center" justifyContent="space-between">
              <Text>Heard Before?</Text>
              <Checkbox
                colorScheme="purple"
                isChecked={loggedBefore}
                onChange={() =>
                  dispatch({
                    type: "state",
                    payload: { key: "loggedBefore", value: !loggedBefore },
                  })
                }
              />
            </Flex>
          </ModalBody>
          <ModalFooter py={2}>
            <Button
              onClick={addData}
              isLoading={isLoading}
              colorScheme="blue"
              size="sm"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );

  function addData() {
    dispatch({
      type: "state",
      payload: {
        key: "isLoading",
        value: true,
      },
    });
    const batch = fuego.db.batch();
    const addDiary = createDiary();
    const addInfo = createInfo();
    if (addDiary) {
      batch.update(fuego.db.collection(user.email).doc("diary"), addDiary);
    }
    if (addInfo) {
      batch.update(fuego.db.collection(user.email).doc("media"), addInfo);
    }
    batch.commit().then(() => {
      dispatch({
        type: "state",
        payload: {
          key: "isLoading",
          value: false,
        },
      });
      return router.push("/");
    });
  }

  function createDiary(): { [key: string]: MediaDiaryAdd } | false {
    if (typeof selected !== "undefined") {
      const dateAdded = new Date();
      const { id, type, releasedDate } = selected;
      return {
        [dateAdded.getTime()]: {
          id: `${type}_${id}`,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          loggedBefore: false,
          rating,
          type,
          releasedDate,
        },
      };
    } else {
      return false;
    }
  }

  function createInfo(): { [key: string]: MediaInfoAdd } | false {
    if (typeof selected !== "undefined") {
      const {
        type,
        artist,
        title,
        poster,
        overview,
        releasedDate,
        genre,
      } = selected;
      return {
        [`${selected?.type}_${selected?.id}`]: {
          type,
          artist,
          title,
          poster,
          genre,
          releasedDate,
          ...(overview && { overview: overview }),
        },
      };
    } else {
      return false;
    }
  }
}

export default Log;
