function ChartTop() {
  return (
    <Box>
      <Heading size="lg">Highest Rated</Heading>
      <Divider mt={3} mb={6} />
      <SimpleGrid columns={{ base: 3, sm: 3, md: 6 }} gap={6}>
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
                boxShadow: `3px 3px 1px ${
                  colorMode === "light" ? purple700 : purple700
                }`,
                borderColor:
                  colorMode === "light" ? "purple.500" : "purple.500",
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
