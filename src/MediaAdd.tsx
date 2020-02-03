import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { useStoreState } from "./config/store";
import MediaSearch from "./MediaSearch";

const useStyles = makeStyles(theme => ({
  card: {
    width: theme.breakpoints.values.sm
  },
  mediaResults: {
    overflow: "scroll",
    maxHeight: "32vh"
  }
}));

// const [type, setType] = useState<MediaTypes["type"]>("film");

const MediaAdd = () => {
  const mediaSelected = useStoreState(state => state.media.mediaSelected);
  const classes = useStyles();
  // console.log(mediaSelected);

  return (
    <Card className={classes.card}>
      {mediaSelected.id !== "" ? <div>has info</div> : <div>asd</div>}
    </Card>
  );
};
export default MediaAdd;

{
  /* <MediaSearch type={type} /> */
}
// {mediaSelected.id !== "" ? (
//   <MediaLog type={type} setType={setType} />
// ) : (
// )}

// <Flex
//         alignItems="center"
//         justifyContent="flex-end"
//         mr={3}
//         borderRight="1px solid var(--border-primary)"
//       >
//         <Text fontSize={3} mr={3} fontWeight={300} color="blue">
//           Add:
//         </Text>
//         <Icon
//           name="film"
//           stroke="primary"
//           height="20px"
//           width="20px"
//           onClick={() => setType("film")}
//           mr={3}
//         />
//         <Icon
//           name="tv"
//           stroke="primary"
//           height="20px"
//           width="20px"
//           onClick={() => setType("tv")}
//           mr={3}
//         />
//         <Icon
//           name="album"
//           stroke="primary"
//           height="20px"
//           width="20px"
//           onClick={() => setType("album")}
//           mr={3}
//         />
//       </Flex>
