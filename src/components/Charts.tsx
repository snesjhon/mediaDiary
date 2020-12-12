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
import type { DiaryAdd, MediaTypes } from "../config/mediaTypes";
import AlbumIcon from "./icons/AlbumIcon";
import LogoFilm from "./icons/FilmIcon";
import StarEmptyIcon from "./icons/StartEmptyIcon";
import TvIcon from "./icons/TvIcon";
import MdLoader from "./md/MdLoader";

function Charts({ user }: { user: firebase.User }): JSX.Element {
  const { displayName, photoURL } = user;
  const { data } = useCollection<DiaryAdd>(
    user !== null && user ? `${user.email}` : null
  );
  const [purple700] = useToken("colors", ["gray.400"]);
  const [ratingType, setRatingType] = useState<MediaTypes | "all">("all");
  const [yearType, setYearType] = useState<number | "all">(
    parseInt(dayjs().format("YYYY"))
  );

  if (!data) {
    return <MdLoader />;
  } else {
    const dataCounts = data.reduce<{
      movie: number;
      tv: number;
      album: number;
      years: { [key: string]: DiaryAdd[] };
    }>(
      (a, c) => {
        if (typeof a[c.type] !== "undefined") {
          a[c.type] = ++a[c.type];
        } else {
          a[c.type] = 1;
        }

        const addedYr = dayjs(c.diaryDate.toDate()).format("YYYY");
        if (typeof a["years"][addedYr] === "undefined") {
          a["years"][addedYr] = [c];
        } else {
          a["years"][addedYr].push(c);
        }
        return a;
      },
      { movie: 0, tv: 0, album: 0, years: { all: data } }
    );

    const yearData = dataCounts.years[yearType];

    const filteredList = yearData.filter((e) =>
      ratingType === "all" ? e : e.type === ratingType
    );

    const ratingCount = filteredList
      .reduce((a, c) => {
        a[c.rating * 2] += 1;
        return a;
      }, Array(11).fill(0))
      .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.5 : e }));

    const yearList = filteredList.reduce<{ [key: string]: number }>((a, c) => {
      const year = dayjs(c.releasedDate).format("YYYY");
      if (typeof a[year] === "undefined") {
        a[year] = 1;
      } else {
        ++a[year];
      }
      return a;
    }, {});
    const yearCount = Object.keys(yearList).map((e) => ({
      year: e,
      count: yearList[e],
    }));

    const topRated = filteredList
      .sort((a, b) => (a.rating > b.rating ? -1 : 1))
      .slice(0, 5);

    return (
      <Box borderLeft="1px solid" borderColor="gray.100" pl={{ md: 8 }} py={10}>
        <Center>
          {Object.keys(dataCounts.years).length > 0 ? (
            <Flex alignItems="flex-end">
              {Object.keys(dataCounts.years)
                .reverse()
                .map((e) => {
                  const yearString = e === "all" ? "all" : parseInt(e);
                  const isActive = yearType === yearString;
                  return (
                    <Heading
                      key={`listyear_${e}`}
                      size={isActive ? "4xl" : undefined}
                      color={!isActive ? "gray.500" : undefined}
                      onClick={() => setYearType(yearString)}
                      pl={3}
                    >
                      {e === "all" ? "ALL" : e}
                    </Heading>
                  );
                })}
            </Flex>
          ) : (
            <Heading size="4xl" as="h1">
              ALL
            </Heading>
          )}
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
                key={e.addedDate + e.mediaId}
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
                  fullSymbol={<StarIcon color="purple.400" w="15px" h="15px" />}
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
        </Box>
        <Divider my={10} />
        <Box>
          <Heading>By Release year</Heading>
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
                  fill: purple700,
                },
              }}
            />
          </VictoryChart>
        </Box>
      </Box>
    );
  }

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

export default Charts;
