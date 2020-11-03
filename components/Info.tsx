import { Center, Flex, Heading, Image, Text } from "@chakra-ui/core";
import React from "react";
import { MediaBase, MediaSelected } from "../config/mediaTypes";

interface Props {
  item: MediaBase | MediaSelected;
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
        <Heading fontWeight="normal" fontSize="md">
          {item.artist}
        </Heading>
        <Heading fontWeight="bold" fontStyle="italic" fontSize="lg">
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
