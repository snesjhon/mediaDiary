import { Center, Flex, Heading, Image, Text } from "@chakra-ui/core";
import React from "react";
import { MediaAdd, MediaSelected } from "../config/mediaTypes";

interface Props {
  item: MediaAdd | MediaSelected;
}

function Info({ item }: Props) {
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        textAlign="center"
      >
        <Text fontSize="xl" lineHeight={1}>
          {item.artist}
        </Text>
        <Heading fontWeight="bold" fontStyle="italic" fontSize="2xl">
          {item.title}
        </Heading>
      </Flex>
      <Center mt={3} mb={1}>
        <Image
          src={item.poster}
          w="8rem"
          borderRadius="5px"
          border="1px solid"
          borderColor="gray.300"
          loading="eager"
        />
      </Center>
      <Center>
        <Text fontSize="xs" color="gray.400">
          {item.genre && <>{item.genre} • </>}
          {typeof item.releasedDate !== "undefined" &&
            `${new Date(item.releasedDate).toLocaleDateString("en-us", {
              year: "numeric",
            })}`}
        </Text>
      </Center>
    </>
  );
}

export default Info;
