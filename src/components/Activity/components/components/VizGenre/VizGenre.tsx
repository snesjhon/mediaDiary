import { Box, useColorMode, useToken, Text } from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";

export interface VizGenreProps {
  list: {
    [key: string]: number;
  };
}

export default function VizGenre({ list }: VizGenreProps): JSX.Element {
  const { colorMode } = useColorMode();
  const [purple500, borderColor, zeroColor] = useToken("colors", [
    "purple.500",
    colorMode === "light" ? "gray.50" : "gray.700",
    colorMode === "light" ? "purple.200" : "gray.600",
  ]);

  // Get the largest count to fill -- the filler
  let data = Object.keys(list)
    .map((e) => ({
      genre: e,
      count: list[e],
    }))
    .sort((a, b) => (a.count > b.count ? 1 : -1));

  // Based on the largest count use a filler to get better tooltip
  data = data.map((e) => ({
    ...e,
    filler: data[data.length - 1].count - e.count,
  }));

  return (
    <Box my="8">
      <Box mb="2">
        <Text fontSize="xl" color="gray.500">
          By
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          Genre
        </Text>
      </Box>
      <Box p="8" bgColor={colorMode === "light" ? "gray.50" : "gray.700"}>
        <Box maxW={{ sm: "98%", md: "100%" }}>
          <Box height="300px">
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
              margin={{ left: 150 }}
              data={data}
              keys={["count", "filler"]}
              indexBy="genre"
              enableLabel={false}
              enableGridY={false}
              padding={0}
              layout="horizontal"
              axisTop={null}
              axisRight={null}
              axisBottom={null}
              borderWidth={3}
              axisLeft={{ tickSize: 0, tickPadding: 20 }}
              borderColor={borderColor}
              animate={true}
              tooltip={({ index }) => <TooltipFormat index={index} />}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: "15px",
                      fontWeight: 500,
                      fill: colorMode === "light" ? "black" : "white",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  function TooltipFormat({ index }: { index: number }) {
    const { count, genre } = data[index];
    return (
      <Box textAlign="center">
        <Text mb={0} pb={0} color="black">
          {count === 0.8 || count === 0.25 || count === 0.5 ? 0 : count}{" "}
          Memories
        </Text>
        <Text fontSize="sm" color="gray.600">
          {genre}
        </Text>
      </Box>
    );
  }
}
