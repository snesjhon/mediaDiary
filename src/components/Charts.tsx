import { RepeatIcon, StarIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import Rating from "react-rating";
import useSWR from "swr";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import type { DiaryAdd, DiaryState, MediaTypes } from "../config/types";
import { useMDDispatch } from "../config/store";
import type { FuegoValidatedUser } from "../interfaces/fuegoProvider";
import AlbumIcon from "./icons/AlbumIcon";
import LogoFilm from "./icons/FilmIcon";
import StarEmptyIcon from "./icons/StartEmptyIcon";
import TvIcon from "./icons/TvIcon";
import MdLoader from "./md/MdLoader";

interface DiaryAddWithId extends DiaryAdd {
  id: string;
}

function Charts({ user }: { user: FuegoValidatedUser }): JSX.Element {
  const { colorMode } = useColorMode();
  const [gray400, purple700] = useToken("colors", ["gray.400", "purple.300"]);
  const [ratingType, setRatingType] = useState<MediaTypes | "all">("all");
  const [yearType, setYearType] = useState<number | "all">(
    parseInt(dayjs().format("YYYY"))
  );
  const [includeSeen, setIncludeSeen] = useState(false);
  const dispatch = useMDDispatch();
  const filterButtonSize = useBreakpointValue({ base: "xs", md: "sm" });

  // const { data, error } = useSWR<DiaryState>(
  //   user && user !== null && typeof user.uid !== "undefined"
  //     ? ["/fuego/diaryAll", user.uid]
  //     : null,
  //   fuegoDiaryGetAll,
  //   {
  //     revalidateOnFocus: false,
  //   }
  // );

  // There's an error on the list, or the list is empty
  // if (error) {
  //   return <div>nothing in this list</div>;
  // }
  return <div>working on it</div>;

  // if (!data) {
  //   return <MdLoader />;
  // } else {
  //   const dataCounts = Object.keys(data).reduce<{
  //     movie: number;
  //     tv: number;
  //     album: number;
  //     years: { [key: string]: DiaryAddWithId[] };
  //   }>(
  //     (a, c) => {
  //       const item = { id: c, ...data[c] };
  //       if (typeof a[item.type] !== "undefined") {
  //         a[item.type] = ++a[item.type];
  //       } else {
  //         a[item.type] = 1;
  //       }

  //       const addedYr = dayjs(item.diaryDate).format("YYYY");
  //       if (typeof a["years"][addedYr] === "undefined") {
  //         a["years"][addedYr] = [item];
  //       } else {
  //         a["years"][addedYr].push(item);
  //       }
  //       return a;
  //     },
  //     {
  //       movie: 0,
  //       tv: 0,
  //       album: 0,
  //       years: { all: Object.keys(data).map((e) => ({ id: e, ...data[e] })) },
  //     }
  //   );

  //   const yearData = dataCounts.years[yearType];

  //   const filteredList = yearData
  //     .filter((e) => (includeSeen ? e : !e.loggedBefore))
  //     .filter((e) => (ratingType === "all" ? e : e.type === ratingType));

  //   const ratingCount = filteredList
  //     .reduce((a, c) => {
  //       a[c.rating * 2] += 1;
  //       return a;
  //     }, Array(11).fill(0))
  //     .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.5 : e }));

  //   const yearList = filteredList.reduce<{ [key: string]: number }>((a, c) => {
  //     const year = dayjs(c.releasedDate).format("YYYY");
  //     if (typeof a[year] === "undefined") {
  //       a[year] = 1;
  //     } else {
  //       ++a[year];
  //     }
  //     return a;
  //   }, {});
  //   const yearCount = Object.keys(yearList).map((e) => ({
  //     year: e,
  //     count: yearList[e],
  //   }));

  //   const topRated = filteredList
  //     .sort((a, b) => (a.rating > b.rating ? -1 : 1))
  //     .slice(0, 6);

  //   return (
  //     <Box
  //       py={10}
  //       borderLeftWidth={{ base: 0, md: "1px" }}
  //       borderRightWidth={{ base: 0, md: "1px" }}
  //       px={{ md: 8 }}
  //     >
  //       <Center>
  //         {Object.keys(dataCounts.years).length > 0 ? (
  //           <Flex alignItems="flex-end">
  //             {Object.keys(dataCounts.years)
  //               .reverse()
  //               .map((e) => {
  //                 const yearString = e === "all" ? "all" : parseInt(e);
  //                 const isActive = yearType === yearString;
  //                 return (
  //                   <Heading
  //                     key={`listyear_${e}`}
  //                     size={isActive ? "4xl" : undefined}
  //                     color={!isActive ? "gray.500" : undefined}
  //                     onClick={() => setYearType(yearString)}
  //                     pl={3}
  //                   >
  //                     {e === "all" ? "ALL" : e}
  //                   </Heading>
  //                 );
  //               })}
  //           </Flex>
  //         ) : (
  //           <Heading size="4xl" as="h1">
  //             ALL
  //           </Heading>
  //         )}
  //       </Center>
  //       {user && user !== null && (
  //         <Flex alignItems="center" justifyContent="center" mt={4}>
  //           {user.photoURL !== null && <Avatar src={user.photoURL} size="sm" />}
  //           {user.displayName !== null && (
  //             <Text fontWeight="semibold" ml={3} color="gray.500">
  //               {user.displayName}&apos;s year to date
  //             </Text>
  //           )}
  //         </Flex>
  //       )}
  //       <Divider my={10} />
  //       <StatGroup textAlign="center">
  //         <Stat>
  //           <StatLabel>
  //             <LogoFilm /> Movies
  //           </StatLabel>
  //           <StatNumber>{dataCounts["movie"]}</StatNumber>
  //         </Stat>

  //         <Stat>
  //           <StatLabel>
  //             <TvIcon /> TV
  //           </StatLabel>
  //           <StatNumber>{dataCounts["tv"]}</StatNumber>
  //         </Stat>
  //         <Stat>
  //           <StatLabel>
  //             <AlbumIcon /> Albums
  //           </StatLabel>
  //           <StatNumber>{dataCounts["album"]}</StatNumber>
  //         </Stat>
  //       </StatGroup>
  //       <Divider my={10} />
  //       <Flex alignItems="center" justifyContent="space-between" pb={10}>
  //         <Flex alignItems="center" justifyContent="flex-end">
  //           <Text color="gray.500" mr={2} fontSize="sm">
  //             Filter:
  //           </Text>
  //           <Box>
  //             <FilterButton title="All" type="all" />
  //             <FilterButton title="By Movie" type="movie" />
  //             <FilterButton title="By Tv" type="tv" />
  //             <FilterButton title="By Album" type="album" />
  //           </Box>
  //         </Flex>
  //         <Flex alignItems="center">
  //           <Tooltip label="Include Repeated Media">
  //             <IconButton
  //               variant={includeSeen ? undefined : "outline"}
  //               colorScheme={includeSeen ? "purple" : undefined}
  //               icon={
  //                 <RepeatIcon color={includeSeen ? "gray.50" : "gray.700"} />
  //               }
  //               aria-label="Repeated Viewed"
  //               size={filterButtonSize}
  //               onClick={() => setIncludeSeen(!includeSeen)}
  //             />
  //           </Tooltip>
  //         </Flex>
  //       </Flex>
  //       <Box>
  //         <Heading size="lg">Highest Rated</Heading>
  //         <Divider mt={3} mb={6} />
  //         <SimpleGrid columns={{ base: 3, sm: 3, md: 6 }} gap={6}>
  //           {topRated.map((e) => (
  //             <Grid
  //               key={e.addedDate + e.mediaId}
  //               gridTemplateRows="1fr 2rem 1.5rem"
  //               alignItems="flex-end"
  //             >
  //               <Image
  //                 src={e.poster}
  //                 borderRadius="5px"
  //                 border="1px solid"
  //                 borderColor="gray.300"
  //                 onClick={() =>
  //                   dispatch({
  //                     type: "day",
  //                     payload: {
  //                       diaryId: e.id,
  //                       diary: e,
  //                     },
  //                   })
  //                 }
  //                 _hover={{
  //                   boxShadow: `3px 3px 1px ${
  //                     colorMode === "light" ? purple700 : purple700
  //                   }`,
  //                   borderColor:
  //                     colorMode === "light" ? "purple.500" : "purple.500",
  //                   cursor: "pointer",
  //                 }}
  //               />
  //               <Text isTruncated fontSize="sm">
  //                 {e.title}
  //               </Text>
  //               <Rating
  //                 fractions={2}
  //                 readonly
  //                 initialRating={e.rating}
  //                 fullSymbol={
  //                   <StarIcon
  //                     color="purple.400"
  //                     w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
  //                     h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
  //                   />
  //                 }
  //                 emptySymbol={
  //                   <StarEmptyIcon
  //                     stroke="purple.400"
  //                     w={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
  //                     h={{ base: "10px", sm: "15px", md: "10px", lg: "15px" }}
  //                   />
  //                 }
  //               />
  //             </Grid>
  //           ))}
  //         </SimpleGrid>
  //       </Box>
  //       <Box mt={16}>
  //         <Heading size="lg">Rating Distribution</Heading>
  //         <Divider mt={3} mb={6} />
  //         <Flex alignItems="flex-end">
  //           <RatingIcon />
  //           <VictoryBar
  //             barRatio={1.2}
  //             data={ratingCount}
  //             x="rating"
  //             y="count"
  //             height={75}
  //             padding={{ top: 0, bottom: 0, left: 30, right: 30 }}
  //             style={{
  //               data: {
  //                 fill: gray400,
  //               },
  //             }}
  //           />
  //           <Flex>
  //             <RatingIcon />
  //             <RatingIcon />
  //             <RatingIcon />
  //             <RatingIcon />
  //             <RatingIcon />
  //           </Flex>
  //         </Flex>
  //       </Box>
  //       <Box mt={16}>
  //         <Heading size="lg">By Release year</Heading>
  //         <Divider mt={3} mb={6} />
  //         <VictoryChart
  //           height={100}
  //           padding={{ top: 0, bottom: 40, left: 20, right: 20 }}
  //         >
  //           <VictoryAxis
  //             tickCount={2}
  //             style={{
  //               axis: {
  //                 strokeWidth: 0,
  //               },
  //               tickLabels: { fontSize: 10, padding: 5 },
  //             }}
  //           />
  //           <VictoryBar
  //             barRatio={0.75}
  //             data={yearCount}
  //             x="year"
  //             y="count"
  //             style={{
  //               data: {
  //                 fill: gray400,
  //               },
  //             }}
  //           />
  //         </VictoryChart>
  //       </Box>
  //     </Box>
  //   );
  // }

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
        size={filterButtonSize}
        colorScheme="purple"
        mr={2}
      >
        {title}
      </Button>
    );
  }
}

export default Charts;
