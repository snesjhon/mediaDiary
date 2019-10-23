import React, { useState } from "react";
import { Box, Grid, Text, Button, Flex, Icon } from "./components";
import styled from "styled-components";
import DatePicker from "react-date-picker";
import Rating from "react-rating";
// import DatePicker from "react-date-picker/dist/entry.nostyle";
// import "./styles/github.css";
// import "../node_modules/react-date-picker/dist/DatePicker.css";

const PosterImg = styled.img`
  box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35);
`;

// into a function and not4se3o
const MediaContainer = props => {
  const { selected, type } = props;
  let poster, title, published, overview, artist, watched;
  if (type === "film") {
    poster = `https://image.tmdb.org/t/p/w200/${selected.poster_path}`;
    title = selected.title;
    published = selected.release_date;
    overview = selected.overview;
    watched = "Watched";
  } else if (type === "tv") {
    poster = `https://image.tmdb.org/t/p/w200/${selected.poster_path}`;
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
  const { selected, type } = props;
  const [date, setDate] = useState(new Date());
  const [seen, setSeen] = useState(false);
  // console.log(selected, type);
  // If type is Album, then make another API request for the year. LOL.
  return (
    <Grid gridTemplateColumns="12rem 1fr" gridGap="2rem">
      <MediaContainer selected={selected} type={type}>
        {({ poster, title, published, watched }) => (
          <>
            <Box>
              <Text mb={2}>back</Text>
              <Box>
                <PosterImg src={poster} />
              </Box>
            </Box>
            <Box>
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
                <Rating fractions={2} />
              </Flex>
              <Flex mt={3}>
                <Icon
                  mr={2}
                  cursor="pointer"
                  stroke="var(--secondary)"
                  height="25px"
                  width="25px"
                  name={seen ? "checked" : "unchecked"}
                  onClick={() => setSeen(!seen)}
                />
                <Text>I&apos;ve {watched} This Before</Text>
              </Flex>
              <Flex mt={4} pt={2} justifyContent="flex-end">
                <Button variant="primary">Save</Button>
              </Flex>
            </Box>
          </>
        )}
      </MediaContainer>
    </Grid>
  );
};

export default MediaLog;
