import { Box, Heading, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import type { FilterData } from "../../config/types";

function ChartAll({ data }: { data: FilterData }): JSX.Element {
  return (
    <>
      <Box mt={16}>
        <Heading size="lg">Rating Distribution</Heading>
        <Divider mt={3} mb={6} />
        <Flex alignItems="flex-end">
          {/* <RatingIcon /> */}
          <VictoryBar
            barRatio={1.2}
            data={ratingCount}
            x="rating"
            y="count"
            height={75}
            padding={{ top: 0, bottom: 0, left: 30, right: 30 }}
            style={{
              data: {
                fill: gray400,
              },
            }}
          />
          {/* <Flex>
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
            <RatingIcon />
          </Flex> */}
        </Flex>
      </Box>
      <Box mt={16}>
        <Heading size="lg">By Release year</Heading>
        <Divider mt={3} mb={6} />
        <VictoryChart
          height={100}
          padding={{ top: 0, bottom: 40, left: 20, right: 20 }}
        >
          <VictoryAxis
            tickCount={2}
            style={{
              axis: {
                strokeWidth: 0,
              },
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryBar
            barRatio={0.75}
            data={yearCount}
            x="year"
            y="count"
            style={{
              data: {
                fill: gray400,
              },
            }}
          />
        </VictoryChart>
      </Box>
    </>
  );
}
export default ChartAll;
