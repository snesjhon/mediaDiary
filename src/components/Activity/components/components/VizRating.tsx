import { MdRating } from "@/md";
import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useColorMode, useToken } from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";

export default function VizRating({ list }: { list: number[] }): JSX.Element {
  const { colorMode } = useColorMode();
  const [purple500, borderColor, zeroColor] = useToken("colors", [
    "purple.500",
    colorMode === "light" ? "gray.50" : "gray.700",
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
    <Box my="8">
      <Box mb="2">
        <Text fontSize="xl" color="gray.500">
          By
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          Rating Distribution
        </Text>
      </Box>
      <Box p="8" bgColor={colorMode === "light" ? "gray.50" : "gray.700"}>
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

function RatingIcon() {
  return <StarIcon color="purple.400" w="15px" h="15px" />;
}
