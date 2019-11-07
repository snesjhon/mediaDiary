import React, { useState } from "react";
import { Box, Grid, Text, Button, Flex, Icon } from "./components";
import styled from "styled-components";
import DatePicker from "react-date-picker";
// import Rating from "react-rating";
import { addMedia } from "./config/actions";

const PosterImg = styled.img`
  box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35);
`;

const MediaContainer = props => {
  const { selected, type } = props;
  let poster, title, published, overview, artist, watched;
  if (type === "film") {
    poster = `https://image.tmdb.org/t/p/w400/${selected.poster_path}`;
    title = selected.title;
    published = selected.release_date;
    overview = selected.overview;
    watched = "Watched";
  } else if (type === "tv") {
    poster = `https://image.tmdb.org/t/p/w400/${selected.poster_path}`;
    title = selected.name;
    published = selected.first_air_date;
    overview = selected.overview;
    watched = "Watched";
  } else if (type === "album") {
    poster = selected.image[3]["#text"];
    title = selected.name;
    artist = selected.artist;
    watched = "Listened To";
  }

  return props.children({
    poster,
    title,
    published,
    overview,
    artist,
    watched
  });
};

const MediaLog = props => {
  const { selected, setSelected, setType, type } = props;
  const [date, setDate] = useState(new Date());
  const [seen, setSeen] = useState(false);
  const [star, setStar] = useState(0);
  // If type is Album, then make another API request for the year. LOL.
  return (
    <Grid gridTemplateColumns="14rem 1fr" gridGap="2rem">
      <MediaContainer selected={selected} type={type}>
        {({ poster, title, published, watched }) => (
          <>
            <Box>
              <PosterImg src={poster} />
            </Box>
            <Flex flexDirection="column">
              <Text mb={2} color="secondary">
                I {watched} ...
              </Text>
              <Text mt={3} fontSize={4} alignItems="center">
                {title}
                <Text as="span" fontWeight="300" fontSize={3} ml={1}>
                  (
                  {new Date(published).toLocaleDateString("en-us", {
                    year: "numeric"
                  })}
                  )
                </Text>
              </Text>
              <Flex mt={4} alignItems="center">
                <Text mr={2} pb={0} color="secondary">
                  On
                </Text>
                <DatePicker onChange={date => setDate(date)} value={date} />
              </Flex>
              <Flex mt={3} pt={2}>
                <Text mr={2} pb={0} color="secondary">
                  Rating
                </Text>
                {/* <Rating
                  fractions={2}
                  emptySymbol={
                    <Icon
                      name="starEmpty"
                      height="25px"
                      width="25px"
                      stroke="var(--primary)"
                    />
                  }
                  fullSymbol={
                    <Icon
                      name="starFull"
                      height="25px"
                      width="25px"
                      stroke="var(--primary)"
                    />
                  }
                  onClick={e => setStar(e)}
                  initialRating={star}
                /> */}
              </Flex>
              <Flex mt={3} alignItems="center">
                <Text color="var(--secondary)" mr={3}>
                  {watched} Before?
                </Text>
                <Icon
                  mr={2}
                  cursor="pointer"
                  height="25px"
                  width="25px"
                  stroke="var(--primary)"
                  name={seen ? "checked" : "unchecked"}
                  onClick={() => setSeen(!seen)}
                />
              </Flex>
              <Flex mt="auto" pt={2} justifyContent="flex-end">
                <Button
                  variant="secondary"
                  mr={3}
                  onClick={() => setSelected({})}
                >
                  Go Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setType("");
                    setSelected({});
                    return addMedia(selected, type, date, star, seen);
                  }}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </MediaContainer>
    </Grid>
  );
};

export default MediaLog;
