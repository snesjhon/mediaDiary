import React from "react";
import { Box, Grid, Text } from "./components";
import styled from "styled-components";

const PosterImg = styled.img`
  box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35);
`;

const MediaLog = props => {
  const { original_title, release_date, poster_path } = props.selected;
  return (
    <Grid gridTemplateColumns="1fr 1fr" gridGap="2rem">
      <Box>
        <Text mb={2}>back</Text>
        <Box>
          <PosterImg src={`https://image.tmdb.org/t/p/w200/${poster_path}`} />
        </Box>
      </Box>
      <Box>
        <Text fontSize={2} mb={2} color="secondary">
          I Watched...
          {/* //type */}
        </Text>
        <Text fontSize={4} alignItems="center">
          {original_title}
          <Text as="span" fontWeight="300" fontSize={3} ml={1}>
            (
            {new Date(release_date).toLocaleDateString("en-us", {
              year: "numeric"
            })}
            )
          </Text>
        </Text>
      </Box>
    </Grid>
  );
};

export default MediaLog;
