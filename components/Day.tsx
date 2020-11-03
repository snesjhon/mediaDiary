import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  Image,
} from "@chakra-ui/core";
import { EditIcon, InfoOutlineIcon, StarIcon } from "@chakra-ui/icons";
import { useDocument } from "@nandorojo/swr-firestore";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Rating from "react-rating";
import { DiaryAdd } from "../config/mediaTypes";
import { ContextDispatch } from "../config/store";
import useUser from "../utils/useUser";
import StarEmptyIcon from "./Icons/StartEmptyIcon";

function Day({ diaryId }: { diaryId: string }) {
  const { user } = useUser();
  const dispatch = useContext(ContextDispatch);
  const { data } = useDocument<DiaryAdd>(
    user !== null && user ? `${user.email}/${diaryId}` : null
  );
  const router = useRouter();
  if (data) {
    const {
      rating,
      diaryDate,
      artist,
      title,
      poster,
      genre,
      releasedDate,
    } = data;
    return (
      <>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
        >
          <Text fontSize="lg">{artist}</Text>
          <Heading
            fontWeight="bold"
            fontStyle="italic"
            size="lg"
            lineHeight={1.3}
          >
            {title}
          </Heading>
        </Flex>
        <Grid
          gridTemplateColumns="0.6fr 0.4fr"
          gridGap="1.5rem"
          justifyContent="center"
          mt={6}
        >
          <Box>
            <Image
              src={poster}
              w="13rem"
              borderRadius="5px"
              border="1px solid"
              borderColor="gray.300"
              loading="eager"
            />
          </Box>
          <Flex flexDirection="column" justifyContent="space-around">
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Date
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                {dayjs(diaryDate.toDate()).format("MMM D, YYYY")}
              </Text>
            </Box>
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Rating
              </Text>
              <Text fontWeight="bold">
                <Rating
                  fractions={2}
                  readonly
                  initialRating={rating}
                  fullSymbol={<StarIcon color="purple.400" w="20px" h="20px" />}
                  emptySymbol={
                    <StarEmptyIcon stroke="purple.400" w="20px" h="20px" />
                  }
                />
              </Text>
            </Box>
            <Box>
              <Text fontWeight={500} fontSize="sm">
                Edit
              </Text>
              <IconButton
                icon={<EditIcon />}
                aria-label="edit"
                variant="outline"
                size="sm"
                colorScheme="green"
                isRound
                onClick={() => {
                  dispatch({
                    type: "edit",
                    payload: {
                      diaryId,
                      diary: data,
                    },
                  });
                  router.push("/home/?view=edit", "/edit", {
                    shallow: true,
                  });
                }}
              />
            </Box>
          </Flex>
        </Grid>
        <Text fontSize="xs" color="gray.400" mt={1}>
          {genre && <>{genre} • </>}
          {typeof releasedDate !== "undefined" &&
            `${new Date(releasedDate).toLocaleDateString("en-us", {
              year: "numeric",
            })}`}
        </Text>
        <Divider mt={3} mb={2} />
      </>
    );
  }
  return <div>Nothing to show</div>;
}

export default Day;
