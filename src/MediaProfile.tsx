import * as React from "react";
import { useState } from "react";
import { Box, Text, Button, Input } from "./components";
import Navigation from "./Navigation";
import { useStoreState, useStoreActions } from "./config/store";

const MediaProfile = () => {
  const user = useStoreState(state => state.global.user);
  const preferences = useStoreState(state => state.global.preferences);
  const userPutPreferences = useStoreActions(
    actions => actions.global.userPutPreferences
  );
  const [localTheme, setLocalTheme] = useState(preferences.theme);
  const [localYear, setLocalYear] = useState(preferences.year);

  return (
    <>
      <Navigation />
      <Box>
        <Text>Preferences</Text>
        <Text>User Information</Text>
        <img src={(user !== null && user.photoURL) || undefined} width="40px" />
        <Text>Theme</Text>
        <select
          onChange={e => {
            const target = e.target.value;
            if (target === "light" || target === "dark") {
              setLocalTheme(target);
            }
          }}
          value={localTheme}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <Text>Year</Text>
        <Input
          type="text"
          onChange={e => setLocalYear(e.target.value)}
          defaultValue={localYear !== null ? localYear : undefined}
        />

        <Button
          onClick={() =>
            userPutPreferences({ theme: localTheme, year: localYear })
          }
        >
          Save
        </Button>
      </Box>
    </>
  );
};

export default MediaProfile;
