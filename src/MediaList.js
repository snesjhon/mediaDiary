import React, { useState, useEffect, useContext } from "react";
import { Grid, Flex, Text, Box } from "./components";
import styled from "styled-components";
import { db } from "./config/db";
import { Store } from "./config/store";

const MediaListItem = styled(Grid)`
  ${props =>
    props.isActive &&
    `
    outline: ${props.theme.borders.primary};
    background-color: ${props.theme.bg.secondary}
  `} /* p={2}
                  mb={0}
                  bg={showInfo === list[movieID] && "gray"}
                  // border={showInfo === list[movieID] && "gray"}
                  style={{ outline: "1px solid gray" }} */
`;

const PosterImg = styled.img`
  border: 1px solid var(--border-secondary);
  /* box-shadow: 0 1px 5px rgba(20, 24, 28, 0.2), 0 2px 10px rgba(20, 24, 28, 0.35); */
`;

// const MediaCard = styled(Grid)`
//   position: relative;
//   /* &:before {
//     content: "";
//     position: absolute;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     display: block;
//     z-index: 1;
//     ${props =>
//       props.imgUrl &&
//       `
//       background-image: url(${props.imgUrl});
//       filter: brightness(0.5)
//     `}
//   } */
//   /* filter: "brightness(0.5)" */
// `;

// const MediaCover = styled(Grid)`
//   padding-top: 10rem;
//   ${props =>
//     props.imgUrl &&
//     `
//       background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${props.imgUrl}) top center no-repeat;
//       background-size: cover;
//     `} /* &::before {
//     content: "";
//     display: block;
//     position: absolute;
//     background-color: #000;
//     opacity: 0.5;
//     width: 100%;
//     height: 100%;
//   } */
// `;

// I think it's efficient that you get a render prop with information that'll pass that down
// into a function and not4se3o
const MediaContainer = props => {
  const { mediaInfo: media, mediaItem: item } = props;
  let poster, title, date, overview, artist;
  if (item.type === "film") {
    poster = `https://image.tmdb.org/t/p/w400/${media.poster_path}`;
    title = media.title;
    date = media.release_date;
    overview = media.overview;
  } else if (item.type === "tv") {
    poster = `https://image.tmdb.org/t/p/w400/${media.poster_path}`;
    title = media.name;
    date = media.first_air_date;
    overview = media.overview;
  } else if (item.type === "album") {
    poster = media.image[3]["#text"];
    title = media.name;
    artist = media.artist;
    overview = media.wiki.summary.split("<a href")[0];
  }
  return props.children({
    poster,
    title,
    date,
    overview,
    artist
  });
};

const MediaList = () => {
  const { state, dispatch } = useContext(Store);
  const [list, setList] = useState({});
  const [diary, setDiary] = useState({});
  const [showInfo, setShowInfo] = useState([]);
  const [offTop, setOffTop] = useState();

  const listKeys = Object.keys(list);
  const diaryKeys = Object.keys(diary);
  const mediaDate = showInfo[0];
  const mediaItem = showInfo[1];
  const mediaInfo = showInfo[2];

  useEffect(() => {
    db.collection("media")
      .doc("byID")
      .onSnapshot(function(doc) {
        const currentList = doc.data();
        if (currentList) {
          setList(currentList);
        }
      });
    db.collection("media")
      .doc("byDate")
      .onSnapshot(function(doc) {
        const currentDiary = doc.data();
        if (currentDiary) {
          setDiary(currentDiary);
        }
      });
  }, []);

  useEffect(() => {
    const initKeys = Object.keys(diary);
    if (initKeys.length > 0) {
      initKeys
        .sort((a, b) => new Date(b) - new Date(a))
        .map((date, dateIndex) => {
          Object.keys(diary[date])
            .sort(
              (a, b) =>
                new Date(diary[date][b].dateAdded.toDate()) -
                new Date(diary[date][a].dateAdded.toDate())
            )
            .map((mediaID, mediaIndex) => {
              if (dateIndex === 0 && mediaIndex === 0) {
                setShowInfo([date, diary[date][mediaID], list[mediaID]]);
              }
            });
        });
    }
  }, [diary, list]);

  useEffect(() => {
    if (mediaItem) {
      const nodeOffTop = document.getElementById(mediaItem.id).offsetTop;
      console.log(mediaItem, nodeOffTop, document.getElementById(mediaItem.id));
      if (offTop !== nodeOffTop) {
        setOffTop(nodeOffTop);
      }
    }
  }, [mediaItem, offTop]);

  if (listKeys.length > 0 && diaryKeys.length > 0) {
    return (
      <Grid gridTemplateColumns="0.5fr 1fr" gridGap="1rem" position="relative">
        <Flex flexDirection="column">
          {diaryKeys
            .sort((a, b) => new Date(b) - new Date(a))
            .map((date, dateIndex) => (
              <Grid
                key={date}
                gridTemplateColumns="0.2fr 0.8fr"
                borderTop={dateIndex !== 0 ? "gray" : undefined}
                pt={dateIndex !== 0 ? 3 : undefined}
                mt={dateIndex !== 0 ? 3 : undefined}
              >
                <Text
                  pt={2}
                  color={mediaDate === date ? "var(--blue)" : undefined}
                >
                  {date.replace("-2019", "").replace("-", "/")}
                </Text>
                <Flex flexDirection="column">
                  {Object.keys(diary[date])
                    .sort(
                      (a, b) =>
                        new Date(diary[date][b].dateAdded.toDate()) -
                        new Date(diary[date][a].dateAdded.toDate())
                    )
                    .map(mediaID => (
                      <MediaListItem
                        id={mediaID}
                        key={date + mediaID}
                        isActive={mediaInfo === list[mediaID]}
                        p={2}
                        mb={0}
                        onClick={() =>
                          setShowInfo([
                            date,
                            diary[date][mediaID],
                            list[mediaID]
                          ])
                        }
                      >
                        {currentMedia(diary[date][mediaID], list[mediaID])}
                      </MediaListItem>
                    ))}
                </Flex>
              </Grid>
            ))}
        </Flex>
        {mediaInfo && (
          <Box position="relative">
            <MediaListItem
              isActive={true}
              position="absolute"
              top={offTop}
              maxWidth="60vw"
            >
              <Box p={3} gridTemplateColumns="0.3fr 0.7fr" gridGap="0 1rem">
                <MediaContainer mediaInfo={mediaInfo} mediaItem={mediaItem}>
                  {({ poster, title, date, overview, artist }) => (
                    <Grid gridTemplateColumns="0.7fr 1fr" gridGap="1rem">
                      <Grid gridItem>
                        <PosterImg src={poster} />
                      </Grid>
                      <Grid gridItem>
                        <Text
                          pt={2}
                          pb={artist ? 0 : 2}
                          fontSize={4}
                          fontWeight="600"
                          alignItems="center"
                        >
                          {title}
                          {mediaItem.type !== "album" && (
                            <Text
                              as="span"
                              fontWeight="300"
                              fontSize={3}
                              ml={2}
                            >
                              (
                              {new Date(date).toLocaleDateString("en-us", {
                                year: "numeric"
                              })}
                              )
                            </Text>
                          )}
                        </Text>
                        {artist && (
                          <Text fontSize={3} fontWeight="300" pb={2}>
                            {artist}
                          </Text>
                        )}
                        <Text>{overview}</Text>
                      </Grid>
                    </Grid>
                  )}
                </MediaContainer>
              </Box>
            </MediaListItem>
          </Box>
        )}
      </Grid>
    );
  } else {
    return <div>loading</div>;
  }

  function currentMedia(diaryItem, listItem) {
    let titleID, titleArtist, styleText;
    if (diaryItem.type === "film") {
      titleID = "title";
      styleText = {
        as: "strong",
        textTransform: "uppercase"
      };
    } else if (diaryItem.type === "tv") {
      titleID = "original_name";
      styleText = {
        textTransform: "uppercase"
      };
    } else if (diaryItem.type === "album") {
      titleArtist = "artist";
      titleID = "name";
      styleText = {
        fontStyle: "italic"
      };
    }

    return (
      <Text {...styleText}>
        {listItem[titleID]} {titleArtist && `- ${listItem[titleArtist]}`}
      </Text>
    );
  }
};

export default MediaList;
