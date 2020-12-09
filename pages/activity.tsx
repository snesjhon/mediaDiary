import { StarIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Image,
  SimpleGrid,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  useToken,
} from "@chakra-ui/react";
import { useCollection } from "@nandorojo/swr-firestore";
import dayjs from "dayjs";
import React, { useState } from "react";
import Rating from "react-rating";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import AlbumIcon from "../components/Icons/AlbumIcon";
import LogoFilm from "../components/Icons/FilmIcon";
import StarEmptyIcon from "../components/Icons/StartEmptyIcon";
import TvIcon from "../components/Icons/TvIcon";
import LayoutMain from "../components/Layouts/LayoutMain";
import { DiaryAdd, MediaTypes } from "../config/mediaTypes";
import { useAuth } from "../utils/auth";

function Activity(): JSX.Element {
  const [purple700] = useToken("colors", ["gray.400"]);
  const { user } = useAuth();
  const { data } = useCollection<DiaryAdd>(
    user !== null && user ? `${user.email}` : null
  );
  const [ratingType, setRatingType] = useState<MediaTypes | "all">("all");

  if (user !== null && user) {
    const { email, displayName, photoURL } = user;
    if (data) {
      // console.log(data);
      const dataCounts = data.reduce(
        (a, c) => {
          if (typeof a[c.type] !== "undefined") {
            a[c.type] = ++a[c.type];
          } else {
            a[c.type] = 1;
          }
          return a;
        },
        { movie: 0, tv: 0, album: 0 }
      );

      const filteredList = data.filter((e) =>
        ratingType === "all" ? e : e.type === ratingType
      );

      const ratingCount = filteredList
        .reduce((a, c) => {
          a[c.rating * 2] += 1;
          return a;
        }, Array(11).fill(0))
        .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.5 : e }));

      console.log(ratingCount);

      const yearList = filteredList.reduce<{ [key: string]: number }>(
        (a, c) => {
          const year = dayjs(c.releasedDate).format("YYYY");
          if (typeof a[year] === "undefined") {
            a[year] = 1;
          } else {
            ++a[year];
          }
          return a;
        },
        {}
      );
      const yearCount = Object.keys(yearList).map((e) => ({
        year: e,
        count: yearList[e],
      }));

      const topRated = filteredList
        .sort((a, b) => (a.rating > b.rating ? -1 : 1))
        .slice(0, 5);

      return (
        <LayoutMain>
          <Box
            borderLeft="1px solid"
            borderColor="gray.100"
            pl={{ md: 8 }}
            py={10}
          >
            <Center>
              <Heading size="4xl" as="h1">
                ALL
              </Heading>
            </Center>
            <Flex alignItems="center" justifyContent="center" mt={4}>
              {photoURL !== null && <Avatar src={photoURL} size="sm" />}
              {displayName !== null && (
                <Text fontWeight="semibold" ml={3} color="gray.500">
                  {displayName}&apos;s year to date
                </Text>
              )}
            </Flex>
            <Divider my={10} />
            <StatGroup textAlign="center">
              <Stat>
                <StatLabel>
                  <LogoFilm /> Movies
                </StatLabel>
                <StatNumber>{dataCounts["movie"]}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>
                  <TvIcon /> TV
                </StatLabel>
                <StatNumber>{dataCounts["tv"]}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>
                  <AlbumIcon /> Albums
                </StatLabel>
                <StatNumber>{dataCounts["album"]}</StatNumber>
              </Stat>
            </StatGroup>
            <Divider my={10} />
            <Flex pb={10} alignItems="center" justifyContent="flex-end">
              <Text color="gray.500" mr={2}>
                Filter:
              </Text>
              <Box>
                <FilterButton title="All" type="all" />
                <FilterButton title="By Movie" type="movie" />
                <FilterButton title="By Tv" type="tv" />
                <FilterButton title="By Album" type="album" />
              </Box>
            </Flex>
            <Box>
              <Heading mb={8}>Highest Rated</Heading>
              <SimpleGrid columns={5} gap={6}>
                {topRated.map((e) => (
                  <Grid
                    key={e.id}
                    gridTemplateRows="1fr 2rem 1.5rem"
                    alignItems="flex-end"
                  >
                    <Image
                      src={e.poster}
                      borderRadius="5px"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                    <Text isTruncated>{e.title}</Text>
                    <Rating
                      fractions={2}
                      readonly
                      initialRating={e.rating}
                      fullSymbol={
                        <StarIcon color="purple.400" w="15px" h="15px" />
                      }
                      emptySymbol={
                        <StarEmptyIcon stroke="purple.400" w="15px" h="15px" />
                      }
                    />
                  </Grid>
                ))}
              </SimpleGrid>
            </Box>
            <Divider my={10} />
            <Box>
              <Heading pb={8}>Rating Distribution</Heading>
              <Flex alignItems="flex-end">
                <RatingIcon />
                <VictoryBar
                  barRatio={1.2}
                  data={ratingCount}
                  x="rating"
                  y="count"
                  height={75}
                  padding={{ top: 0, bottom: 0, left: 30, right: 30 }}
                  style={{
                    data: {
                      fill: purple700,
                    },
                  }}
                />
                <Flex>
                  <RatingIcon />
                  <RatingIcon />
                  <RatingIcon />
                  <RatingIcon />
                  <RatingIcon />
                </Flex>
              </Flex>
              {/* </VictoryChart> */}
            </Box>
            <Divider my={10} />
            <Box>
              <Heading>By Release year</Heading>
              {/* <VictoryChart>
                <VictoryBar data={yearCount} x="year" y="count" />
              </VictoryChart> */}
              <VictoryChart
                height={100}
                // width={600}
                padding={{ top: 0, bottom: 40, left: 20, right: 20 }}
              >
                <VictoryAxis
                  // tickComponent={<Text fontSize="sm" />}
                  tickCount={2}
                  // tickValues={[60, 20]}
                  // tickFormat={(x) => dayjs(x).format("YY")}
                  style={{
                    axis: {
                      strokeWidth: 0,
                    },
                    // ticks: { stroke: "grey", size: 5 },
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
                      fill: purple700,
                    },
                  }}
                />
              </VictoryChart>
            </Box>
          </Box>
        </LayoutMain>
      );
    }
  } else {
    return <div>loading</div>;
  }
  return <div>not</div>;

  function RatingIcon() {
    return <StarIcon color="purple.400" w="15px" h="15px" />;
  }

  function FilterButton({
    title,
    type,
  }: {
    title: string;
    type: MediaTypes | "all";
  }) {
    return (
      <Button
        onClick={() => setRatingType(type)}
        variant={type === ratingType ? undefined : "outline"}
        size="sm"
        colorScheme="purple"
        mr={2}
      >
        {title}
      </Button>
    );
  }
}

export default Activity;
