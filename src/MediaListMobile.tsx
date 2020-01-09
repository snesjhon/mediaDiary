import * as React from "react";
import * as firebase from "firebase/app";
import { useState, useEffect } from "react";
import {
  Grid,
  Flex,
  Text,
  Box,
  Icon,
  Modal,
  Button,
  Image
} from "./components";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "./config/store";
import { DataByDate, DataByID } from "./config/storeData";
import DatePicker from "react-date-picker";
// import useBP from "./hooks/useBP";
// @ts-ignore
import ReactStars from "react-stars";

const MediaMonth = styled(Box)``;
// &:hover .monthDate {
//   // color: ${props => props.theme.colors.blue};
// }
// & > .monthContainer:hover {
//   & .day {
//     cursor: pointer;
//     color: ${props => props.theme.colors["bg-primary"]};
//   }
// }

const CloseContainer = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
`;

interface MediaListItemProps extends DataByID, DataByDate {
  dayID: string;
  handleClose: () => void;
}

const MediaListItem = ({
  dayID,
  handleClose,
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
  const [localStar, setlocalStar] = useState(star);
  const [localDate, setLocalDate] = useState(date);
  const [localSeen, setLocalSeen] = useState(seen);
  const dataDelete = useStoreActions(actions => actions.data.dataDelete);
  const dataUpdate = useStoreActions(actions => actions.data.dataUpdate);
  const isModified =
    localStar === star && localDate === date && localSeen === seen
      ? true
      : false;
  const gridColumn = type === "album" ? "0.7fr 1fr" : "0.5fr 1fr";

  return (
    <Box position="relative">
      <Grid gridTemplateColumns={["", gridColumn]} gridGap={["", "1rem"]}>
        <Grid gridItem textAlign="center">
          <Image src={poster} width={["30vw", ""]} />
        </Grid>
        <Grid gridItem>
          <Text
            pt={2}
            pb={0}
            fontSize={5}
            fontWeight={600}
            alignItems="center"
            textAlign={["center", "left"]}
          >
            {title}
            <Text as="span" fontWeight={300} fontSize={4} ml={2}>
              (
              {new Date(published).toLocaleDateString("en-us", {
                year: "numeric"
              })}
              )
            </Text>
          </Text>
          {artist && (
            <Text
              fontSize={4}
              fontWeight={300}
              pb={2}
              textAlign={["center", "left"]}
            >
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
                stroke="primary"
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
      <CloseContainer>
        <Icon name="close" onClick={handleClose} />
      </CloseContainer>
    </Box>
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

const MediaListMobile = () => {
  const [data, setData] = useState<[string, DataByDate, DataByID]>();
  const byID = useStoreState(state => state.data.byID);
  const byDate = useStoreState(state => state.data.byDate);
  const dataGet = useStoreActions(actions => actions.data.dataGet);

  useEffect(() => {
    dataGet();
  }, [dataGet]);

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
    const gridLayout = "1.5rem 3rem 1fr";
    const gridGap = "0 1rem";

    return (
      <Box>
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
                  const { star } = diaryDates[month][day];
                  return (
                    <>
                      {dayIndex === 0 ? (
                        <Text
                          key={diaryDates[month][day].date.seconds}
                          className="monthDate"
                          fontSize={4}
                          color="secondary"
                        >
                          {new Date(
                            diaryDates[month][day].date.seconds * 1000
                          ).toLocaleDateString("en-us", {
                            month: "long",
                            year: "numeric"
                          })}
                        </Text>
                      ) : (
                        <div />
                      )}
                      <Grid
                        key={monthIndex + dayIndex}
                        gridTemplateColumns={gridLayout}
                        gridGap={gridGap}
                        py={4}
                        alignItems="center"
                        onClick={() =>
                          setData([
                            day,
                            diaryDates[month][day],
                            byID[diaryDates[month][day].id]
                          ])
                        }
                      >
                        <Text fontSize={4} fontWeight={300} textAlign="center">
                          {new Date(
                            diaryDates[month][day].date.seconds * 1000
                          ).toLocaleDateString("en-us", {
                            day: "numeric"
                          })}
                        </Text>
                        <Box>
                          <Image
                            src={poster}
                            border="1px solid var(--border-secondary)"
                          />
                        </Box>
                        <Box>
                          <Flex>
                            <Text
                              as={type === "film" ? "strong" : undefined}
                              textTransform={
                                type === "album" ? undefined : "uppercase"
                              }
                              fontStyle={
                                type === "album" ? "italic" : undefined
                              }
                            >
                              {title}
                            </Text>
                            <Text pl={2}>
                              {published
                                ? new Date(published).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric"
                                    }
                                  )
                                : "date"}
                            </Text>
                          </Flex>
                          <Box>{artist ? artist : "none"}</Box>
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
                      </Grid>
                    </>
                  );
                })}
            </MediaMonth>
          ))}
        {typeof data !== "undefined" && (
          <Modal
            isOpen={typeof data !== "undefined"}
            handleClose={() => setData(undefined)}
          >
            <MediaListItem
              dayID={data[0]}
              {...data[1]}
              {...data[2]}
              handleClose={() => setData(undefined)}
            />
          </Modal>
        )}
      </Box>
    );
  } else {
    return <div>loading</div>;
  }
};

export default MediaListMobile;
