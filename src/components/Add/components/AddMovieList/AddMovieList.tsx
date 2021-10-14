import { FilmIcon } from "@/icons";
import { ContentDrawer } from "@/src/components/Content/components";
import Rate from "@/src/components/Rate/Rate";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { Button, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMediaTopFetch } from "../../hooks";

export default function AddMovieList(): JSX.Element {
  const [searchType, setSearchType] = useState<"popular" | "">("");
  const [counter, setCounter] = useState(0);
  const { colorMode } = useColorMode();
  const { data, error, isLoading } = useMediaTopFetch({
    type: "movie",
    searchType: searchType,
  });

  return (
    <>
      <Box py={4}>
        <Flex
          alignItems="center"
          borderBottom="1px"
          borderBottomColor={colorMode === "light" ? "gray.300" : "gray.600"}
          pb="2"
          mb="2"
          px={{ md: 8 }}
        >
          <FilmIcon color="purple.500" />
          <Heading size="md" ml={2}>
            Movie
          </Heading>
        </Flex>
        <Button onClick={() => setSearchType("popular")}>Popular</Button>
        <Button onClick={() => setCounter((oldCounter) => oldCounter + 1)}>
          Next
        </Button>
      </Box>
      <ContentDrawer
        isOpen={searchType !== ""}
        onClose={() => setSearchType("")}
        showHeader={false}
      >
        {searchType !== "" && data && data.results.length > 0 && (
          <Rate
            movieResult={data.results[counter]}
            onNext={() => setCounter((oldCounter) => oldCounter + 1)}
          />
        )}
      </ContentDrawer>
    </>
  );
}
