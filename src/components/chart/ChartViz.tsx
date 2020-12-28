import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import MdRating from "../md/MdRating";

export function ChartVizRating({ list }: { list: number[] }): JSX.Element {
  const { colorMode } = useColorMode();
  const [purple500, borderColor, zeroColor] = useToken("colors", [
    "purple.500",
    colorMode === "light" ? "white" : "gray.800",
    colorMode === "light" ? "purple.200" : "gray.600",
  ]);

  let ratingCount = list
    .map((e, i) => ({
      rating: i / 2,
      count: e === 0 ? 0.3 : e,
    }))
    .slice(1);

  // Get the largest count to fill -- the filler
  const sortedByCount = [...ratingCount].sort((a, b) =>
    a.count < b.count ? -1 : 1
  );

  // Based on the largest count use a filler to get better tooltip
  ratingCount = ratingCount.map((e) => ({
    ...e,
    filler: sortedByCount[sortedByCount.length - 1].count - e.count,
  }));

  return (
    <Box mt={10}>
      <Heading size="lg">Rating Distribution</Heading>
      <Divider mt={3} mb={6} />
      <Flex
        alignItems="flex-end"
        height="120px"
        maxW={{ sm: "80%", md: "100%" }}
      >
        <RatingIcon />
        <ResponsiveBar
          colors={({ id, data }) => {
            if (id === "filler") {
              return "transparent";
            } else if (data.count === 0.3) {
              return zeroColor;
            }
            return purple500;
          }}
          data={ratingCount}
          keys={["count", "filler"]}
          indexBy="rating"
          enableLabel={false}
          enableGridY={false}
          padding={0}
          tooltip={({ index }) => <TooltipFormat index={index} />}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          borderWidth={3}
          borderColor={borderColor}
          axisLeft={null}
          animate={true}
        />
        <Flex>
          <RatingIcon />
          <RatingIcon />
          <RatingIcon />
          <RatingIcon />
          <RatingIcon />
        </Flex>
      </Flex>
    </Box>
  );

  function TooltipFormat({ index }: { index: number }) {
    const { rating, count } = ratingCount[index];
    return (
      <Flex alignItems="center">
        <Text fontSize="sm" color="gray.600" mr={1}>
          {count === 0.3 ? 0 : count}
        </Text>
        <MdRating initialRating={rating} wh="10px" />
        <Text fontSize="sm" color="gray.600" ml={1}>
          ratings
        </Text>
      </Flex>
    );
  }
}

export function ChartVizReleased({
  list,
}: {
  list: {
    [key: string]: number;
  };
}): JSX.Element {
  const { colorMode } = useColorMode();
  const [purple500, borderColor, zeroColor] = useToken("colors", [
    "purple.500",
    colorMode === "light" ? "white" : "gray.800",
    colorMode === "light" ? "purple.200" : "gray.600",
  ]);

  const listKeys = Object.keys(list).sort();
  let listComplete: { year: number; count: number }[] = [];

  for (
    let i = parseInt(listKeys[0]);
    i <= parseInt(listKeys[listKeys.length - 1]);
    i++
  ) {
    if (typeof list[i] !== "undefined") {
      listComplete.push({
        year: i,
        count: list[i],
      });
    } else {
      listComplete.push({
        year: i,
        count: 0.8,
      });
    }
  }
  // Get the largest count to fill -- the filler
  const sortedByCount = [...listComplete].sort((a, b) =>
    a.count < b.count ? -1 : 1
  );

  // Based on the largest count use a filler to get better tooltip
  listComplete = listComplete.map((e) => ({
    ...e,
    filler: sortedByCount[sortedByCount.length - 1].count - e.count,
  }));

  if (listComplete.length < 30) {
    listComplete = listComplete.map((e) => ({
      ...e,
      count: e.count === 0.8 ? 0.25 : e.count,
    }));
  }
  if (listComplete.length > 30 && listComplete.length < 50) {
    listComplete = listComplete.map((e) => ({
      ...e,
      count: e.count === 0.8 ? 0.5 : e.count,
    }));
  }

  return (
    <Box mt={16}>
      <Heading size="lg">By Release year</Heading>
      <Divider mt={3} mb={6} />
      <Box height="120px" maxW={{ sm: "98%", md: "100%" }}>
        <ResponsiveBar
          colors={({ id, data }) => {
            if (id === "filler") {
              return "transparent";
            } else if (
              data.count === 0.8 ||
              data.count === 0.25 ||
              data.count === 0.5
            ) {
              return zeroColor;
            }
            return purple500;
          }}
          data={listComplete}
          keys={["count", "filler"]}
          indexBy="year"
          enableLabel={false}
          enableGridY={false}
          padding={0}
          tooltip={({ index }) => <TooltipFormat index={index} />}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          borderWidth={3}
          borderColor={borderColor}
          axisLeft={null}
          animate={true}
        />
      </Box>
      <Flex justifyContent="space-between" px={2}>
        <Box>{listComplete[0].year}</Box>
        <Box>{listComplete[listComplete.length - 1].year}</Box>
      </Flex>
    </Box>
  );

  function TooltipFormat({ index }: { index: number }) {
    const { year, count } = listComplete[index];
    return (
      <Box textAlign="center">
        <Text mb={0} pb={0} color="black">
          {count === 0.8 || count === 0.25 || count === 0.5 ? 0 : count}{" "}
          Memories
        </Text>
        <Text fontSize="sm" color="gray.600">
          Year {year}
        </Text>
      </Box>
    );
  }
}

function RatingIcon() {
  return <StarIcon color="purple.400" w="15px" h="15px" />;
}
