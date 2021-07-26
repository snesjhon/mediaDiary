import { useMDDispatch } from "@/config";
import type { MediaSelected } from "@/types";
import { createPosterURL, parsePosterUrl } from "@/utils";
import { ChevronDownIcon } from "@chakra-ui/icons";
import type { Icon } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";

interface Props {
  data: MediaSelected[];
  title: string;
  DataIcon: typeof Icon;
  seeNumber: number;
  seeAction: (val: number) => void;
}

export default function AddResultList({
  data,
  title,
  DataIcon,
  seeNumber,
  seeAction,
}: Props): JSX.Element | null {
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  return data.length > 0 ? (
    <Box py={4}>
      <Flex
        alignItems="center"
        borderBottom="1px"
        borderBottomColor={colorMode === "light" ? "gray.300" : "gray.600"}
        pb="2"
        mb="2"
        px={{ md: 8 }}
      >
        <DataIcon color="purple.500" />
        <Heading size="md" ml={2}>
          {title}
        </Heading>
      </Flex>
      <Grid gridTemplateColumns="repeat(5, 1fr)" gridGap="4" px={{ md: 8 }}>
        {data.slice(0, seeNumber).map((item: MediaSelected) => (
          <Box
            key={item.mediaId}
            fontSize="sm"
            py={2}
            _hover={{
              bg: colorMode === "light" ? "purple.50" : "gray.800",
              cursor: "pointer",
            }}
            onClick={() =>
              dispatch({
                type: "selected",
                payload: item,
              })
            }
          >
            <Image
              src={createPosterURL(
                parsePosterUrl(item.poster, item.type),
                item.type
              )}
              borderRadius="5px"
              border="1px solid"
              borderColor="gray.300"
              loading="eager"
            />
            <Text>{item.title}</Text>
            {item.artist !== "" ? (
              <Text fontSize="xs" fontStyle="italic" color="gray.500">
                {item.artist}
              </Text>
            ) : item.releasedDate !== "" ? (
              <Text fontSize="xs" fontStyle="italic" color="gray.500">
                {dayjs(item.releasedDate).format("YYYY")}
              </Text>
            ) : null}
          </Box>
        ))}
      </Grid>
      {data.length > seeNumber && (
        <Box px={{ md: 8 }} textAlign="center">
          <Button
            variant="outline"
            onClick={() => seeAction(seeNumber + 5)}
            leftIcon={<ChevronDownIcon />}
          >
            More
          </Button>
        </Box>
      )}
    </Box>
  ) : null;
}
