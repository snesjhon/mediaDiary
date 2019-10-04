import React, { useState, useEffect } from "react";
import { Grid, Flex, Text, Box } from "./components";
import styled from "styled-components";
import { db } from "./config/db";

// const MediaTable = styled(Box)`
//   display: table;
//   overflow: auto;
//   width: 100%;
//   border-collapse: collapse;
//   border-spacing: 0;
// `;

// const TableRow = styled(Box)`
//   display: table-row;
//   border-top: 1px solid #c6cbd1;
//   background-color: #fff;
//   ${props =>
//     props.bold &&
//     `
//     font-weight: bolder;
//   `} /* padding: 5px; */
// `;

// const TableCell = styled(Box)`
//   display: table-cell;
//   border: 1px solid #dfe2e5;
//   padding: 6px 13px;
// `;

// const GridList = styled(Grid)`
//   grid-template-columns: 0.1fr 0.3fr 0.6fr;
// `;

// const MediaItem = styled(Grid)`
//   grid-template-columns: 1fr 1fr;

// `;

const MediaListItem = styled(Grid)`
  ${props =>
    props.isActive &&
    `
    outline: ${props.theme.borders.gray};
    background-color: ${props.theme.colors.gray}
  `} /* p={2}
                  mb={0}
                  bg={showInfo === list[movieID] && "gray"}
                  // border={showInfo === list[movieID] && "gray"}
                  style={{ outline: "1px solid gray" }} */
`;

const MediaCard = styled(Grid)`
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    z-index: 1;
    ${props =>
      props.imgUrl &&
      `
      background-image: url(${props.imgUrl});
      filter: brightness(0.5)
    `}
  }
  /* filter: "brightness(0.5)" */
`;

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

const MediaList = () => {
  const [list, setList] = useState({});
  const [diary, setDiary] = useState({});
  const [showInfo, setShowInfo] = useState([]);
  const [offTop, setOffTop] = useState();

  const listKeys = Object.keys(list);
  const diaryKeys = Object.keys(diary);
  const mediaDate = showInfo[0];
  const mediaInfo = showInfo[1];

  useEffect(() => {
    db.collection("movies")
      .doc("byID")
      .onSnapshot(function(doc) {
        const currentList = doc.data();
        if (currentList) {
          setList(currentList);
          db.collection("movies")
            .doc("byDate")
            .onSnapshot(function(doc) {
              const currentDiary = doc.data();
              if (currentDiary) {
                setDiary(currentDiary);
              }
            });
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
            .map((movieID, movieIndex) => {
              if (dateIndex === 0 && movieIndex === 0) {
                setShowInfo([date, list[movieID]]);
              }
            });
        });
    }
  }, [diary, list]);

  useEffect(() => {
    if (mediaInfo) {
      const nodeOffTop = document.getElementById(mediaInfo.id).offsetTop;
      if (offTop !== nodeOffTop) {
        setOffTop(nodeOffTop);
      }
    }
  }, [mediaInfo, offTop]);

  if (listKeys.length > 0 && diaryKeys.length > 0) {
    return (
      <Grid gridTemplateColumns="0.5fr 1fr" gridGap="1rem">
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
                <Text pt={2} color={mediaDate === date ? "madBlue" : undefined}>
                  {date.replace("-2019", "").replace("-", "/")}
                </Text>
                <Flex flexDirection="column">
                  {Object.keys(diary[date])
                    .sort(
                      (a, b) =>
                        new Date(diary[date][b].dateAdded.toDate()) -
                        new Date(diary[date][a].dateAdded.toDate())
                    )
                    .map(movieID => (
                      <MediaListItem
                        id={movieID}
                        key={date + movieID}
                        isActive={mediaInfo === list[movieID]}
                        p={2}
                        mb={0}
                        onClick={() => setShowInfo([date, list[movieID]])}
                      >
                        <Text as="strong">{list[movieID].title}</Text>
                      </MediaListItem>
                    ))}
                </Flex>
              </Grid>
            ))}
        </Flex>
        {mediaInfo && (
          <Box>
            <MediaListItem
              isActive={true}
              position="absolute"
              top={offTop}
              maxWidth="39vw"
            >
              <MediaCard
                p={3}
                gridTemplateColumns="0.3fr 0.7fr"
                gridGap="0 1rem"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200/${mediaInfo.poster_path}`}
                />
                <Grid gridItem gridTemplateRows="1fr 1fr 1fr" zIndex={2}>
                  <Text
                    py={2}
                    fontSize={4}
                    fontWeight="600"
                    alignItems="center"
                  >
                    {mediaInfo.title}
                    <Text as="span" fontWeight="300" fontSize={3} ml={2}>
                      (
                      {new Date(mediaInfo.release_date).toLocaleDateString(
                        "en-us",
                        {
                          year: "numeric"
                        }
                      )}
                      )
                    </Text>
                  </Text>
                  <Text>{mediaInfo.overview}</Text>
                </Grid>
              </MediaCard>
            </MediaListItem>
          </Box>
        )}
      </Grid>
    );
  } else {
    return <div>loading</div>;
  }
};

export default MediaList;

// {/* <img
//   src={`https://image.tmdb.org/t/p/w780/${mediaInfo.backdrop_path}`}
// /> */}
// <MediaTable>
//   <TableRow bold="bold">
//     <TableCell>Date</TableCell>
//     <TableCell>Poster</TableCell>
//     <TableCell>Title</TableCell>
//     <TableCell>Release Date</TableCell>
//     <TableCell>Rewatched</TableCell>
//   </TableRow>

// </MediaTable>

// <TableCell>
// <Image
//   width="40px"
//   src={`https://image.tmdb.org/t/p/w92/${list[movieID].poster_path}`}
// />
// </TableCell>

// <TableRow onClick={() => setShowInfo(movieID)}>
//                     <TableCell>{date}</TableCell>
//                     <TableCell>{list[movieID].title}</TableCell>
//                     <TableCell>{list[movieID].release_date}</TableCell>
//                     <TableCell>{list[movieID].release_date}</TableCell>
//                   </TableRow>
//                   {movieID === showInfo && (
//                     <TableRow>
//                       <TableCell>{list[movieID].title}</TableCell>
//                       <TableCell>
// <Image
//   src={`https://image.tmdb.org/t/p/w200/${list[movieID].backdrop_path}`}
// />
//                       </TableCell>
//                     </TableRow>
//                   )}

{
  /* <MediaCover
gridTemplateColumns="0.3fr 0.7fr"
gridGap="0 1rem"
imgUrl={`https://image.tmdb.org/t/p/w780/${mediaInfo.backdrop_path}`}
>
<div></div>
<Text
  fontSize={4}
  mb={2}
  px={2}
  fontWeight="600"
  alignItems="center"
  color="white"
>
  {mediaInfo.title}
  <Text as="span" fontWeight="300" fontSize={3} ml={2}>
    (
    {new Date(mediaInfo.release_date).toLocaleDateString(
      "en-us",
      {
        year: "numeric"
      }
    )}
    )
  </Text>
</Text>
</MediaCover> */
}
