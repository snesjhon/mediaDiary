import React, { useContext, useState } from "react";
import { ContextState } from "../utils/store";
import {
  Box,
  Center,
  Image,
  Flex,
  Text,
  Divider,
  Button,
} from "@chakra-ui/core";
import { fuego } from "@nandorojo/swr-firestore";
import useUser from "../utils/useUser";
import { MediaDiaryAdd, MediaInfoAdd } from "../types/mediaTypes";

function Log() {
  const [isLoading, setIsLoading] = useState(false);
  const { selected } = useContext(ContextState);
  const { user } = useUser();
  console.log(selected);
  return (
    <Box>
      <Center mb={3}>
        <Image src={selected?.poster} w="10rem" borderRadius="5px" />
      </Center>
      <Flex alignItems="center" justifyContent="center" flexDir="column">
        <Text fontSize="xl" fontWeight="bold">
          {selected?.title}
        </Text>
        <Text fontSize="md">
          {selected?.artist}{" "}
          {typeof selected?.releasedDate !== "undefined" &&
            `(${new Date(selected.releasedDate).toLocaleDateString("en-us", {
              year: "numeric",
            })})`}
        </Text>
      </Flex>
      <Divider my={4} />
      <Button onClick={addData} isLoading={isLoading}>
        Add Data
      </Button>
    </Box>
  );

  function addData() {
    setIsLoading(true);
    const batch = fuego.db.batch();
    const addDiary = createDiary();
    const addInfo = createInfo();
    if (addDiary) {
      batch.update(fuego.db.collection(user.email).doc("diary"), addDiary);
    }
    if (addInfo) {
      batch.update(fuego.db.collection(user.email).doc("media"), addInfo);
    }
    batch.commit().then(() => setIsLoading(false));
  }

  function createDiary(): { [key: string]: MediaDiaryAdd } | false {
    if (typeof selected !== "undefined") {
      const dateAdded = new Date();
      const { id, type, releasedDate } = selected;
      return {
        [dateAdded.getTime()]: {
          id: `${type}_${id}`,
          diaryDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          addedDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          seenBefore: false,
          star: 8,
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
      const { type, artist, title, poster, overview, releasedDate } = selected;
      return {
        [`${selected?.type}_${selected?.id}`]: {
          type,
          artist,
          title,
          poster,
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
