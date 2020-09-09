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
  Heading,
} from "@chakra-ui/core";
import { fuego } from "@nandorojo/swr-firestore";
import useUser from "../utils/useUser";
import { MediaDiaryAdd, MediaInfoAdd } from "../types/mediaTypes";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { useRouter } from "next/router";

function Log() {
  const [isLoading, setIsLoading] = useState(false);
  const { selected } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();
  return (
    <Layout>
      <Header />
      <Flex alignItems="center" justifyContent="center" flexDir="column">
        <Heading fontWeight="normal" fontSize="xl">
          {selected?.artist}
        </Heading>
        <Heading fontWeight="bold" fontStyle="italic" fontSize="2xl">
          {selected?.title}
        </Heading>
      </Flex>
      <Center mt={3} mb={1}>
        <Image
          src={selected?.poster}
          w="10rem"
          borderRadius="5px"
          border="1px solid"
          borderColor="gray.300"
        />
      </Center>
      <Center>
        <Text fontSize="sm" color="gray.400">
          {selected?.genre} •{" "}
          {typeof selected?.releasedDate !== "undefined" &&
            `${new Date(selected.releasedDate).toLocaleDateString("en-us", {
              year: "numeric",
            })}`}
        </Text>
      </Center>
      <Divider my={4} />
      <Button onClick={addData} isLoading={isLoading}>
        Add Data
      </Button>
    </Layout>
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
    batch.commit().then(() => {
      setIsLoading(false);
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
