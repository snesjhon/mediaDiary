import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { useState } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import Navigation from "./Navigation";
import { Typography, Divider } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    marginRight: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}));

function Profile() {
  const classes = useStyles();
  const preferences = useStoreState(state => state.global.preferences);
  const userPutPreferences = useStoreActions(
    actions => actions.global.userPutPreferences
  );
  const [localTheme, setLocalTheme] = useState(preferences.theme);
  const [localYear, setLocalYear] = useState(preferences.year);

  const currentDate = new Date();
  const yearsRange = Array.from(
    { length: 11 },
    (_, i) => currentDate.getFullYear() - i
  );

  const yearsSelected = yearsRange.filter(year =>
    preferences.years.includes(year.toString())
  );
  const yearsAvailable = yearsRange.filter(
    year => !preferences.years.includes(year.toString())
  );

  return (
    <Container maxWidth="md">
      <Navigation />
      <Box borderColor="grey.300" border={1} borderTop={0} p={2}>
        <Typography variant="h5">Settings</Typography>
        <Box pb={2} pt={1}>
          <Divider />
        </Box>
        <Box display="flex">
          <Box fontWeight="bolder">
            <Typography>Theme</Typography>
          </Box>
          <Select
            labelId="theme-label"
            id="theme"
            value={localTheme}
            onChange={e => {
              const target = e.target.value;
              if (target === "light" || target === "dark") {
                setLocalTheme(target);
              }
            }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography variant="h5">Years</Typography>
          <Typography>Years Available</Typography>

          <Select
            value={localYear}
            onChange={() => {}}
            // onChange={e => {
            //   const target = e.target.value;
            //   if (target === "light" || target === "dark") {
            //     setLocalTheme(target);
            //   }
            // }}
          >
            {yearsSelected.map((e, i) => (
              <MenuItem key={e + i} value={e}>
                {e}
              </MenuItem>
            ))}
            {/* <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem> */}
          </Select>
          <Typography>Add a new Year</Typography>
        </Box>

        <TextField
          label="Year"
          onChange={e => setLocalYear(e.target.value)}
          defaultValue={localYear !== null ? localYear : undefined}
        />
        <Box py={2}>
          <Button
            color="secondary"
            variant="contained"
            disableElevation
            onClick={() =>
              userPutPreferences({
                theme: localTheme,
                year: localYear,
                years: []
              })
            }
          >
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;

// <Box mb={2} fontWeight="fontWeightMedium" fontSize="h5.fontSize">
// Add a new year
// </Box>
