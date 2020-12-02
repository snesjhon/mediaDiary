import { EditIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useDocument } from "@nandorojo/swr-firestore";
import dayjs from "dayjs";
import React, { Suspense } from "react";
import Rating from "react-rating";
import useSWR from "swr";
import { DiaryAdd, MediaTypes } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import { useAuth } from "../utils/auth";
import { fetcher } from "../utils/helpers";
import Edit from "./Edit";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import LayoutDrawer from "./LayoutDrawer";

function Day(): JSX.Element | null {
  const { user } = useAuth();
  const dispatch = useMDDispatch();
  const { view, edit } = useMDState();
  const { data } = useDocument<DiaryAdd>(
    user !== null && user && edit ? `${user.email}/${edit.diaryId}` : null
  );
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

    console.log(data.mediaId);

    return (
      <LayoutDrawer
        placement="bottom"
        isOpen={view === "day" || view === "edit"}
      >
        {view === "edit" ? (
          <Edit />
        ) : (
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
              gridTemplateColumns={{ base: "0.6fr 0.4fr", md: "1fr 1fr" }}
              gridGap="1.5rem"
              justifyContent="center"
              mt={6}
            >
              <Box ml="auto">
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
                      fullSymbol={
                        <StarIcon color="purple.400" w="20px" h="20px" />
                      }
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
                    onClick={() =>
                      dispatch({
                        type: "state",
                        payload: {
                          key: "view",
                          value: "edit",
                        },
                      })
                    }
                  />
                </Box>
              </Flex>
            </Grid>
            <Grid gridTemplateColumns="1fr 1fr" gridGap="1.5rem">
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.500"
                mt={1}
                ml="auto"
                textTransform="uppercase"
              >
                {genre && <>{genre} • </>}
                {typeof releasedDate !== "undefined" &&
                  `${new Date(releasedDate).toLocaleDateString("en-us", {
                    year: "numeric",
                  })}`}
              </Text>
              <div />
            </Grid>
            <Divider mt={3} mb={2} />
            <Suspense fallback={<div>...loading</div>}>
              <DayData
                mediaId={data.mediaId}
                type={data.type}
                season={data.type === "tv" ? data.season : undefined}
              />
            </Suspense>
          </>
        )}
      </LayoutDrawer>
    );
  }
  return null;
}

function DayData({
  mediaId,
  type,
  season,
}: {
  mediaId: string;
  type: MediaTypes;
  season: number | undefined;
}) {
  const fetchURL = createFetch();
  const { data } = useSWR(fetchURL, fetcher, {
    revalidateOnFocus: false,
    suspense: true,
  });
  console.log(data);

  return (
    <Box my={4}>
      <Heading size="md" mb={3}>
        About
      </Heading>
      {data.tagline && (
        <Text
          textTransform="uppercase"
          pb={2}
          fontSize="sm"
          fontWeight={400}
          color="gray.500"
        >
          {data.tagline}
        </Text>
      )}
      <Text>{data.overview}</Text>
      <Divider mt={4} mb={4} />
      <Heading size="md" mb={5}>
        Cast
      </Heading>
      <SimpleGrid columns={4} gap={4}>
        {data.credits.cast.slice(0, 4).map((e: any) => (
          <Box key={e.name}>
            <Image
              src={`https://image.tmdb.org/t/p/w300${e.profile_path}`}
              borderRadius="lg"
              h="150px"
            />
            <Text>{e.name}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
  function createFetch(): string | null {
    if (type === "movie") {
      return `https://api.themoviedb.org/3/movie/${mediaId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,watch/providers,videos`;
    } else if (type === "tv") {
      const idArr = mediaId.split("_");
      return `https://api.themoviedb.org/3/tv/${idArr[0]}/season/${season}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
    }
    return null;
  }
}

export default Day;
