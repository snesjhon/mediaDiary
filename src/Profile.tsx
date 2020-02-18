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

  return (
    <Container maxWidth="md">
      <Navigation />
      <Box borderColor="grey.300" border={1} borderTop={0} p={2}>
        <Box mb={2} fontWeight="fontWeightMedium" fontSize="h5.fontSize">
          Preferences
        </Box>
        <FormControl className={classes.formControl}>
          <InputLabel id="theme-label">Theme</InputLabel>
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
        </FormControl>

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
              userPutPreferences({ theme: localTheme, year: localYear })
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
