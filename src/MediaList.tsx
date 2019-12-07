import * as React from "react";
import * as firebase from "firebase/app";
import { useState, useEffect } from "react";
import { Grid, Flex, Text, Box, Icon, Modal, Button } from "./components";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "./config/store";
import { DataByDate, DataByID } from "./config/storeData";
import DatePicker from "react-date-picker";
// @ts-ignore
import ReactStars from "react-stars";

const MediaMonth = styled(Box)`
  &:hover .monthDate {
    color: ${props => props.theme.colors.blue};
  }
  & > .monthContainer:hover {
    & .day {
      cursor: pointer;
      color: ${props => props.theme.colors["bg-primary"]};
    }
  }
`;

const PosterImg = styled.img`
  border: 1px solid var(--border-secondary);
`;

interface MediaListItemProps extends DataByID, DataByDate {
  dayID: string;
}

const MediaListItem = ({
  dayID,
  type,
  star,
  poster,
  title,
  published,
  artist,
  overview,
  seen,
  date
}: MediaListItemProps) => {
  // const itemID = content[0];
  // const item = content[1];
  const [localStar, setlocalStar] = useState(star);
  const [localDate, setLocalDate] = useState(date);
  const [localSeen, setLocalSeen] = useState(seen);
  const dataDelete = useStoreActions(actions => actions.data.dataDelete);
  const dataUpdate = useStoreActions(actions => actions.data.dataUpdate);
  const isModified =
    localStar === star && localDate === date && localSeen === seen
      ? true
      : false;

  console.log(localStar, star);

  return (
    <Grid
      gridTemplateColumns={type === "album" ? "0.7fr 1fr" : "0.5fr 1fr"}
      gridGap="1rem"
    >
      <Grid gridItem>
        <PosterImg src={poster} />
      </Grid>
      <Grid gridItem>
        <Text pt={2} pb={0} fontSize={4} fontWeight={600} alignItems="center">
          {title}
          <Text as="span" fontWeight={300} fontSize={3} ml={2}>
            (
            {new Date(published).toLocaleDateString("en-us", {
              year: "numeric"
            })}
            )
          </Text>
        </Text>
        {artist && (
          <Text fontSize={3} fontWeight={300} pb={2}>
            {artist}
          </Text>
        )}
        <Text>{overview}</Text>
        <Flex justifyContent="space-between" py={4}>
          <Box>
            <Text color="secondary">Rated</Text>
            <ReactStars
              count={5}
              half
              value={localStar}
              size={20}
              color1="var(--secondary)"
              color2="var(--primary)"
              onChange={(e: any) => setlocalStar(e)}
            />
          </Box>
          <Box>
            <Text color="secondary">On</Text>
            <DatePicker
              onChange={(date: Date) =>
                setLocalDate(firebase.firestore.Timestamp.fromDate(date))
              }
              value={localDate.toDate()}
            />
          </Box>
          <Box>
            <Text color="secondary">Watched?</Text>
            <Icon
              mr={2}
              cursor="pointer"
              height="25px"
              width="25px"
              stroke="var(--primary)"
              name={localSeen ? "checked" : "unchecked"}
              onClick={() => {
                setLocalSeen(!localSeen);
              }}
            />
          </Box>
        </Flex>
        <Flex mt="auto" pt={2} justifyContent="flex-end">
          <Button variant="delete" mr={3} onClick={() => dataDelete(dayID)}>
            Delete
          </Button>
          <Button
            variant={isModified ? "secondary" : "primary"}
            onClick={dataSave}
          >
            Save
          </Button>
        </Flex>
      </Grid>
    </Grid>
  );

  function dataSave() {
    dataUpdate({
      dayID,
      modifiedDate: localDate,
      modifiedSeen: localSeen,
      modifiedStar: localStar,
      cb: () => {
        console.log("updated");
      }
    });
  }
};

const MediaList = () => {
  const [data, setData] = useState<[string, DataByDate, DataByID]>();
  const byID = useStoreState(state => state.data.byID);
  const byDate = useStoreState(state => state.data.byDate);
  const dataGet = useStoreActions(actions => actions.data.dataGet);

  useEffect(() => {
    dataGet();
  }, []);

  if (typeof byID !== "undefined" && typeof byDate !== "undefined") {
    const diaryDates = Object.keys(byDate).reduce<{
      [key: string]: {
        [key: string]: DataByDate;
      };
    }>((a, c) => {
      const month = new Date(byDate[c].date.seconds * 1000).toLocaleDateString(
        "en-us",
        {
          month: "numeric"
        }
      );
      a[month] = Object.assign({ ...a[month] }, { [c]: byDate[c] });
      return a;
    }, {});
    const gridLayout = "3rem 2rem 3rem 22rem 10rem 4rem 6rem 6rem";
    const gridGap = "0 1.5rem";

    return (
      <>
        <Grid
          gridTemplateColumns={gridLayout}
          gridGap={gridGap}
          alignItems="center"
          borderBottom="1px solid"
          borderColor="border-secondary"
          fontSize={0}
          color="secondary"
          style={{ textTransform: "uppercase" }}
        >
          <Text>Month</Text>
          <Text textAlign="center">Day</Text>
          <Text>Poster</Text>
          <Text>Title</Text>
          <Text>Artist</Text>
          <Text>Released</Text>
          <Text>Rating</Text>
          <Text textAlign="center">Rewatch</Text>
        </Grid>
        {Object.keys(diaryDates)
          .reverse()
          .map((month, monthIndex) => (
            <MediaMonth key={monthIndex} pb={3}>
              {Object.keys(diaryDates[month])
                .sort(
                  (a, b) =>
                    diaryDates[month][b].date.seconds -
                    diaryDates[month][a].date.seconds
                )
                .map((day, dayIndex) => {
                  const { title, poster, published, artist, type } = byID[
                    diaryDates[month][day].id
                  ];
                  const { star, seen } = diaryDates[month][day];
                  return (
                    <Grid
                      key={monthIndex + dayIndex}
                      gridTemplateColumns={gridLayout}
                      gridGap={gridGap}
                      py={3}
                      alignItems="center"
                      onClick={() =>
                        setData([
                          day,
                          diaryDates[month][day],
                          byID[diaryDates[month][day].id]
                        ])
                      }
                    >
                      {dayIndex === 0 ? (
                        <Text
                          className="monthDate"
                          fontSize={4}
                          color="secondary"
                        >
                          {new Date(
                            diaryDates[month][day].date.seconds * 1000
                          ).toLocaleDateString("en-us", {
                            month: "short"
                          })}
                        </Text>
                      ) : (
                        <div />
                      )}
                      <Text fontSize={3} fontWeight={300} textAlign="center">
                        {new Date(
                          diaryDates[month][day].date.seconds * 1000
                        ).toLocaleDateString("en-us", {
                          day: "numeric"
                        })}
                      </Text>
                      <Flex>
                        <PosterImg src={poster} />
                      </Flex>
                      <Text
                        as={type === "film" ? "strong" : undefined}
                        textTransform={
                          type === "album" ? undefined : "uppercase"
                        }
                        fontStyle={type === "album" ? "italic" : undefined}
                      >
                        {title}
                      </Text>
                      <Box>{artist ? artist : "none"}</Box>
                      <Box>
                        {published
                          ? new Date(published).toLocaleDateString("en-US", {
                              year: "numeric"
                            })
                          : "date"}
                      </Box>
                      <Box>
                        <ReactStars
                          count={5}
                          half
                          value={star}
                          edit={false}
                          size={16}
                          color1="var(--secondary)"
                          color2="var(--primary)"
                        />
                      </Box>
                      <Box textAlign="center">
                        {seen ? (
                          <Icon
                            mr={2}
                            height="20px"
                            width="20px"
                            stroke="var(--text-primary)"
                            name="repeat"
                          />
                        ) : null}
                      </Box>
                    </Grid>
                  );
                })}
            </MediaMonth>
          ))}
        {typeof data !== "undefined" && (
          <Modal
            isOpen={typeof data !== "undefined"}
            handleClose={() => setData(undefined)}
          >
            <MediaListItem dayID={data[0]} {...data[1]} {...data[2]} />
          </Modal>
        )}
      </>
    );
  } else {
    return <div>loading</div>;
  }
};

export default MediaList;
