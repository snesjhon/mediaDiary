import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { useStoreActions, useStoreState } from "./config/store";
import Navigation from "./Navigation";

const useStyles = makeStyles(theme => ({
  form: {
    minWidth: 120
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

  const currentDate = new Date();
  const yearsRange = Array.from(
    { length: 11 },
    (_, i) => currentDate.getFullYear() - i
  );

  const yearsSelected = yearsRange.filter(year =>
    preferences.years.includes(year)
  );
  const yearsAvailable = yearsRange.filter(
    year => !preferences.years.includes(year)
  );

  const [localTheme, setLocalTheme] = useState(preferences.theme);
  const [localYear, setLocalYear] = useState(preferences.year);

  return (
    <Container maxWidth="md">
      <Navigation />
      <Box borderColor="grey.300" border={1} borderTop={0} p={2}>
        <Box py={4}>
          <Grid container spacing={5}>
            <Grid item xs={5}>
              <Box textAlign="center">
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
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box display="flex" flexDirection="column">
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold" mb={2}>
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
                <Box py={2} />
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Current Year
                  </Box>
                </Typography>
                <Select
                  className={classes.form}
                  value={localYear}
                  onChange={(
                    e: React.ChangeEvent<{
                      name?: string | undefined;
                      value: string;
                    }>
                  ) => setLocalYear(e.target.value)}
                >
                  {yearsSelected.map((e, i) => (
                    <MenuItem key={"yearSelect" + i} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
                <Box display="flex" pt={5} justifyContent="space-between">
                  <Button>+ Add New Year</Button>
                  <Button
                    size="large"
                    color="secondary"
                    variant="contained"
                    disableElevation
                    onClick={() =>
                      userPutPreferences({
                        theme: localTheme,
                        year: localYear,
                        years: yearsSelected
                      })
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Profile;
