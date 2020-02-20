import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
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
  form: {
    minWidth: 120
    // marginRight: theme.spacing(2),
    // paddingBottom: theme.spacing(2)
  },
  avatar: {
    borderRadius: "50%",
    width: theme.spacing(12),
    height: theme.spacing(12),
    border: `1px solid ${theme.palette.primary.main}`,
    padding: "2px"
  }
}));

function Profile() {
  const classes = useStyles();
  const user = useStoreState(state => state.global.user);
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

  console.log(user);

  return (
    <Container maxWidth="md">
      <Navigation />
      <Box borderColor="grey.300" border={1} borderTop={0} p={2}>
        <Typography variant="h5">Account Settings</Typography>
        <Box pb={2} pt={1}>
          <Divider />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Typography>
              <Box component="span" fontWeight="fontWeightBold">
                Stats
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                className={classes.avatar}
                src={(user !== null && user.photoURL) || ""}
              />
              <Typography component="div">
                <Box fontWeight="fontWeightBold">
                  {user !== null && user.displayName}
                </Box>
              </Typography>
              <Typography>{user !== null && user.email}</Typography>
              <Typography>
                <Box component="span" fontWeight="fontWeightBold">
                  Theme
                </Box>
              </Typography>
              <Select
                className={classes.form}
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
              <Box mt={4}>
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Current Year
                  </Box>
                </Typography>
                <Select
                  className={classes.form}
                  value={localYear}
                  onChange={() => {}}
                >
                  {yearsSelected.map((e, i) => (
                    <MenuItem key={e + i} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h5">Years</Typography>
          <Typography>Years Available</Typography>

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
