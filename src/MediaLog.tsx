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
  const dataPut = useStoreActions(actions => actions.data.dataPut);
  const [date, setDate] = useState(new Date());
  const [seen, setSeen] = useState(false);
  const [star, setStar] = useState(0);
  const [info, setInfo] = useState();
  const [season, setSeason] = useState();
  const [loading, setLoading] = useState(type === "tv" ? true : false);

  useEffect(() => {
    if (type === "tv") {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_MDB}&language=en-US`
      )
        .then(r => r.json())
        .then(info => {
          setInfo(info);
          setSeason(info.seasons[0]);
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
                  value={season.id}
                  onChange={e =>
                    setSeason(
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
    setType("");
    dataPut({
      type,
      id,
      artist,
      overview,
      poster,
      published,
      title,
      seen,
      star
    });
  }
};

export default MediaLog;

// interface MediaContainerProps extends MediaTypes {
//   selected: {
//     [key: string]: any;
//   };
//   info: {
//     [key: string]: any;
//   };
//   children(props: {
//     poster: string;
//     title: string;
//     published: Date;
//     overview: string;
//     artist: string;
//     watched: string | undefined;
//     seasons: Object | undefined;
//   }): JSX.Element;
// }

// const MediaContainer = (props: MediaContainerProps) => {
//   const { selected, type, info } = props;
//   let poster, title, published, overview, artist, watched, seasons;
//   if (type === "film") {
//     poster = `https://image.tmdb.org/t/p/w400/${selected.poster_path}`;
//     title = selected.title;
//     published = selected.release_date;
//     overview = selected.overview;
//     watched = "Watched";
//   } else if (type === "tv") {
//     poster = `https://image.tmdb.org/t/p/w400/${selected.poster_path}`;
//     title = selected.name;
//     published = selected.first_air_date;
//     overview = selected.overview;
//     watched = "Watched";
//     seasons = info.seasons;
//   } else if (type === "album") {
//     poster = selected.image[3]["#text"];
//     title = selected.name;
//     artist = selected.artist;
//     watched = "Listened To";
//   }

//   return props.children({
//     poster,
//     title,
//     published,
//     overview,
//     artist,
//     watched,
//     seasons
//   });
// };

// interface MediaLog extends MediaTypes {
//   selected: any; // based on the response
//   setSelected: React.Dispatch<React.SetStateAction<Object>>;
//   setType: React.Dispatch<React.SetStateAction<string>>;
// }
