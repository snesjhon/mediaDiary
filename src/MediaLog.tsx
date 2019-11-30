import * as React from "react";
import { useState, useEffect } from "react";
import { Box, Grid, Text, Button, Flex, Icon } from "./components";
import styled from "styled-components";
import DatePicker from "react-date-picker";
import { MediaTypes } from "./config/types";
import { useStoreState, useStoreActions } from "./config/store";
// @ts-ignore
import ReactStars from "react-stars";

const PosterImg = styled.img`
  box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35);
`;

interface MediaLog extends MediaTypes {
  setType: React.Dispatch<React.SetStateAction<string>>;
}

const MediaLog = ({ type, setType }: MediaLog) => {
  const {
    id,
    artist,
    overview,
    poster,
    published,
    title,
    watched
  } = useStoreState(state => state.media.mediaSelected);
  const mediaSelect = useStoreActions(actions => actions.media.mediaSelect);
  const mediaPutFilm = useStoreActions(actions => actions.media.mediaPutFilm);
  const mediaPutTV = useStoreActions(actions => actions.media.mediaPutTV);
  const mediaPutAlbum = useStoreActions(actions => actions.media.mediaPutAlbum);
  // const dataPut = useStoreActions(actions => actions.data.dataPut);
  const [date, setDate] = useState(new Date());
  const [seen, setSeen] = useState(false);
  const [star, setStar] = useState(0);
  const [info, setInfo] = useState();
  const [seasonInfo, setSeasonInfo] = useState();
  const [loading, setLoading] = useState(type === "tv" ? true : false);

  useEffect(() => {
    if (type === "tv") {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_MDB}&language=en-US`
      )
        .then(r => r.json())
        .then(info => {
          setInfo(info);
          setSeasonInfo(info.seasons[0]);
          setLoading(false);
        });
    }
  }, [type, id]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <Grid gridTemplateColumns="14rem 1fr" gridGap="2rem">
        <Box>
          <PosterImg src={poster} />
        </Box>
        <Flex flexDirection="column">
          <Text mb={2} color="secondary">
            I {watched} ...
          </Text>
          <Text mt={3} fontSize={4} alignItems="center">
            {title}
            <Text as="span" fontWeight={300} fontSize={3} ml={1}>
              (
              {new Date(published).toLocaleDateString("en-us", {
                year: "numeric"
              })}
              )
            </Text>
          </Text>
          <Flex mt={3} alignItems="center">
            {typeof info !== "undefined" &&
              typeof info.seasons !== "undefined" && (
                <select
                  value={seasonInfo.id}
                  onChange={e =>
                    setSeasonInfo(
                      info.seasons.find(
                        (u: any) => u.id === parseInt(e.target.value)
                      )
                    )
                  }
                >
                  {info.seasons.map((e: any) => (
                    <option key={e.name} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              )}
          </Flex>
          <Flex mt={4} alignItems="center">
            <Text mr={2} pb={0} color="secondary">
              On
            </Text>
            <DatePicker onChange={(date: Date) => setDate(date)} value={date} />
          </Flex>
          <Flex mt={3} pt={2}>
            <Text mr={2} pb={0} color="secondary">
              Rating
            </Text>
            <ReactStars
              count={5}
              half
              value={star}
              size={20}
              onChange={(e: any) => setStar(e)}
              color1="var(--secondary)"
              color2="var(--primary)"
            />
          </Flex>
          <Flex mt={3} alignItems="center">
            <Text color="econdary" mr={3}>
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
            <Button variant="secondary" mr={3} onClick={() => mediaSelect()}>
              Go Back
            </Button>
            <Button variant="primary" onClick={mediaSet}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Grid>
    );
  }

  function mediaSet() {
    const mediaObj = {
      type,
      id,
      overview,
      poster,
      published,
      title,
      seen,
      star,
      date
    };
    if (type === "film") {
      const filmObj = {
        ...mediaObj,
        artist
      };
      mediaPutFilm(filmObj);
    } else if (type === "tv") {
      const tvObj = {
        ...mediaObj,
        id: seasonInfo.id,
        title: `${title} (${seasonInfo.name})`,
        artist: info.created_by.map((e: any) => e.name).join(", "),
        season: seasonInfo.season_number,
        published: seasonInfo.air_date,
        poster: seasonInfo.poster_path
      };

      mediaPutTV(tvObj);
    } else {
      const albumObj = {
        ...mediaObj,
        artist
      };
      mediaPutAlbum(albumObj);
    }
    setType("");
  }
};

export default MediaLog;
