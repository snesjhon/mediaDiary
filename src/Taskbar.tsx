import * as React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  taskBar: {
    position: "sticky",
    top: "0",
  },
  thisYear: {
    backgroundColor: "#0000000a",
  },
}));

function Taskbar() {
  const classes = useStyles();
  return (
    <Box>
      <Box p={2} className={classes.taskBar}>
        <TextField
          id="outlined-basic"
          label="Search.."
          variant="outlined"
          size="small"
          fullWidth
        />
        <Box className={classes.thisYear} p={2} mt={2}>
          <Box color="#592ABC">
            <Typography variant="h6">This Year</Typography>
          </Box>

          <Typography>Film</Typography>
          <Typography>TV Shows</Typography>
          <Typography>Albums</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Taskbar;
