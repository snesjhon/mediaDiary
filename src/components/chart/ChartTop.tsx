import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import Rating from "react-rating";
import { useMDDispatch } from "../../config/store";
import type { DiaryAddWithId } from "../../types/typesMedia";
import { createPosterURL } from "../../utils/helpers";
import StarEmptyIcon from "../icons/StartEmptyIcon";

function ChartTop({ list }: { list: DiaryAddWithId[] }): JSX.Element {
  const dispatch = useMDDispatch();
  const [purple700] = useToken("colors", ["purple.700"]);
  return (
    <Box>
      <Heading size="lg">Highest Rated</Heading>
      <Divider mt={3} mb={6} />
      <SimpleGrid
        columns={{ base: 3, sm: 3, md: 6 }}
        gap={{ base: 6, sm: 12, md: 6 }}
      >
        {list.map((e) => (
          <Grid
            key={e.addedDate + e.mediaId}
            gridTemplateRows="1fr 2rem 1.5rem"
            alignItems="flex-end"
          >
            <Image
              src={createPosterURL(e.poster, e.type)}
              borderRadius="5px"
              border="1px solid"
              borderColor="gray.300"
              onClick={() =>
                dispatch({
                  type: "day",
                  payload: e,
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

export default ChartTop;
