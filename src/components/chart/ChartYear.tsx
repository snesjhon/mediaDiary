import React from "react";

function ChartYear() {
  const dispatch = useMDDispatch();

  const { colorMode } = useColorMode();
  const [gray400, purple700] = useToken("colors", ["gray.400", "purple.300"]);
  const [ratingType, setRatingType] = useState<MediaTypes | null>(null);
  const [includeSeen, setIncludeSeen] = useState(false);
  const filterButtonSize = useBreakpointValue({ base: "xs", md: "sm" });
  const { data: yearData, error: yearError } = useSWR<DiaryAddWithId[]>(
    yearType !== null
      ? [
          "/fuego/chartYear",
          user.uid,
          yearType,
          ratingType,
          null,
          null,
          includeSeen,
          null,
        ]
      : null,
    fuegoChartYear,
    { revalidateOnFocus: false }
  );
  // const dataCounts = Object.keys(data).reduce<{
  //   movie: number;
  //   tv: number;
  //   album: number;
  //   years: { [key: string]: DiaryAddWithId[] };
  // }>(
  //   (a, c) => {
  //     const item = { id: c, ...data[c] };
  //     if (typeof a[item.type] !== "undefined") {
  //       a[item.type] = ++a[item.type];
  //     } else {
  //       a[item.type] = 1;
  //     }

  //     const addedYr = dayjs(item.diaryDate).format("YYYY");
  //     if (typeof a["years"][addedYr] === "undefined") {
  //       a["years"][addedYr] = [item];
  //     } else {
  //       a["years"][addedYr].push(item);
  //     }
  //     return a;
  //   },
  //   {
  //     movie: 0,
  //     tv: 0,
  //     album: 0,
  //     years: { all: Object.keys(data).map((e) => ({ id: e, ...data[e] })) },
  //   }
  // );

  // const yearData = dataCounts.years[yearType];

  // const filteredList = yearData
  //   .filter((e) => (includeSeen ? e : !e.loggedBefore))
  //   .filter((e) => (ratingType === "all" ? e : e.type === ratingType));

  // const ratingCount = filteredList
  //   .reduce((a, c) => {
  //     a[c.rating * 2] += 1;
  //     return a;
  //   }, Array(11).fill(0))
  //   .map((e, i) => ({ rating: i / 2, count: e === 0 ? 0.5 : e }));

  // const yearList = filteredList.reduce<{ [key: string]: number }>((a, c) => {
  //   const year = dayjs(c.releasedDate).format("YYYY");
  //   if (typeof a[year] === "undefined") {
  //     a[year] = 1;
  //   } else {
  //     ++a[year];
  //   }
  //   return a;
  // }, {});
  // const yearCount = Object.keys(yearList).map((e) => ({
  //   year: e,
  //   count: yearList[e],
  // }));

  // const topRated = filteredList
  //   .sort((a, b) => (a.rating > b.rating ? -1 : 1))
  //   .slice(0, 6);

  return (
    <>
      {yearType !== null && (
        <Flex alignItems="center" justifyContent="space-between" pb={10}>
          <Flex alignItems="center" justifyContent="flex-end">
            <Text color="gray.500" mr={2} fontSize="sm">
              Filter:
            </Text>
            <Box>
              <FilterButton title="All" type="all" />
              <FilterButton title="By Movie" type="movie" />
              <FilterButton title="By Tv" type="tv" />
              <FilterButton title="By Album" type="album" />
            </Box>
          </Flex>
          <Flex alignItems="center">
            <Tooltip label="Include Repeated Media">
              <IconButton
                variant={includeSeen ? undefined : "outline"}
                colorScheme={includeSeen ? "purple" : undefined}
                icon={
                  <RepeatIcon color={includeSeen ? "gray.50" : "gray.700"} />
                }
                aria-label="Repeated Viewed"
                size={filterButtonSize}
                onClick={() => setIncludeSeen(!includeSeen)}
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
      <Box mt={16}>
        <Heading size="lg">Rating Distribution</Heading>
        <Divider mt={3} mb={6} />
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
                fill: gray400,
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
        onClick={() => setRatingType(type === "all" ? null : type)}
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
