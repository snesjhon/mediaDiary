/**
 * ABOUT
 * ---
 * Just general information about what MediaDiary is about and how I came to write it.
 *
 */

import * as React from "react";
import { useState } from "react";
import { Box, Text, Icon, Flex, Button, Input } from "./components";
import { useStoreActions } from "./config/store";
import { UserTheme } from "./config/storeGlobal";

const MediaPreference = () => {
  const userPutPreferences = useStoreActions(
    actions => actions.global.userPutPreferences
  );
  const [year, setYear] = useState(
    new Date().toLocaleDateString([], { year: "numeric" })
  );
  const [theme, setTheme] = useState<UserTheme>("light");
  return (
    <Box>
      <Flex flexDirection="column" alignItems="center">
        <Flex mt={4}>
          <Icon name="album" mr={3} stroke="var(--orange)" />
          <Icon name="tv" mr={3} stroke="var(--blue)" />
          <Icon name="film" mr={3} stroke="var(--secondary)" />
        </Flex>
        <Text fontSize={5} textAlign="center" fontWeight={600} mt={2}>
          MediaDiary
        </Text>
      </Flex>
      <Box my={3} borderTop="1px solid #d1d5da" />
      <Text>Choose Theme</Text>
      <select
        onChange={e => {
          const target = e.target.value;
          if (target === "light" || target === "dark") {
            setTheme(target);
          }
        }}
        value={theme}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <Text>Choose Year</Text>
      <Input
        type="text"
        onChange={e => setYear(e.target.value)}
        placeholder={year.toString()}
      />

      <Button onClick={() => userPutPreferences({ theme, year })}>
        Submit
      </Button>
    </Box>
  );
};

export default MediaPreference;
