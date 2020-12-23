import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Divider,
  SimpleGrid,
  Grid,
  Image,
  Text,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import Rating from "react-rating";
import useSWR from "swr";
import { useMDDispatch } from "../../config/store";
import { fuegoChartTop6 } from "../../interfaces/fuegoChartActions";
import StarEmptyIcon from "../icons/StartEmptyIcon";
import MdLoader from "../md/MdLoader";

function ChartTop({
  year,
  uid,
}: {
  year: number | null;
  uid: string;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const [purple700] = useToken("colors", ["purple.700"]);
  const { data, error } = useSWR(
    ["fuego/chartTop", uid, year],
    fuegoChartTop6,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    return (
      <Box>
        <Heading size="lg">Highest Rated</Heading>
        <Divider mt={3} mb={6} />
        <SimpleGrid columns={{ base: 3, sm: 3, md: 6 }} gap={6}>
          {data.map((e) => (
            <Grid
              key={e.addedDate + e.mediaId}
              gridTemplateRows="1fr 2rem 1.5rem"
              alignItems="flex-end"
            >
              <Image
                src={e.poster}
                borderRadius="5px"
                border="1px solid"
                borderColor="gray.300"
                onClick={() =>
                  dispatch({
                    type: "day",
                    payload: {
                      diaryId: e.id,
                      diary: e,
                    },
                  })
                }
                _hover={{
                  boxShadow: `3px 3px 1px ${purple700}`,
                  borderColor: "purple.500",
                  cursor: "pointer",
                }}
              />
              <Text isTruncated fontSize="sm">
                {e.title}
              </Text>
              <Rating
                fractions={2}
                readonly
                initialRating={e.rating}
                fullSymbol={
                  <StarIcon
                    color="purple.400"
                    w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                    h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                  />
                }
                emptySymbol={
                  <StarEmptyIcon
                    stroke="purple.400"
                    w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                    h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
                  />
                }
              />
            </Grid>
          ))}
        </SimpleGrid>
      </Box>
    );
  }
  return <MdLoader />;
}

export default ChartTop;
