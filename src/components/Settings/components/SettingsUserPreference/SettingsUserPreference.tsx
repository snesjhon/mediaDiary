import { MEDIA_TYPES, useMDDispatch, useMDState } from "@/config";
import { fuegoSetPreferences } from "@/fuego";
import type {
  MediaTypesArr,
  UserFuegoPref,
  UserFuegoValidated,
  UserPref,
} from "@/types";
import { createMediaTypes, createMediaTypesArr } from "@/utils";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  HStack,
  Radio,
  RadioGroup,
  useCheckboxGroup,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function SettingsUserPreference({
  user,
  preference,
  cb,
}: {
  user: UserFuegoValidated;
  preference?: UserFuegoPref;
  cb?: () => void;
}): JSX.Element {
  const hasPreference =
    typeof preference !== "undefined" && preference !== null && preference;
  const { setValue, value } = useCheckboxGroup({
    defaultValue: hasPreference
      ? createMediaTypesArr(hasPreference["mediaTypes"])
      : MEDIA_TYPES,
  });
  const [theme, setTheme] = useState<UserPref["theme"]>(
    hasPreference ? hasPreference["theme"] : "light"
  );
  const [error, setError] = useState<false | string>(false);
  const dispatch = useMDDispatch();
  const { isSaving } = useMDState();

  useEffect(() => {
    if (error && value.length >= 1) {
      setError(false);
    }
  }, [value, error]);

  return (
    <>
      {error && <Text>{error}</Text>}
      <Box mb={8}>
        <Text fontWeight="semibold" mb={2}>
          I&apos;d like to track the following:
        </Text>
        <CheckboxGroup onChange={(val) => setValue(val)} defaultValue={value}>
          <HStack spacing={10}>
            {MEDIA_TYPES.map((e) => (
              <Checkbox key={`mediaType_${e}`} value={e}>
                {e}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </Box>
      <Box mb={8}>
        <Text mb={2} fontWeight="semibold">
          I want my theme to be:
        </Text>
        <RadioGroup
          onChange={(val) => setTheme(val as UserPref["theme"])}
          value={theme}
        >
          <HStack spacing={10}>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
          </HStack>
        </RadioGroup>
      </Box>
      <Button onClick={setPreference} isLoading={isSaving} colorScheme="blue">
        Save
      </Button>
    </>
  );

  async function setPreference() {
    if (value.length >= 1) {
      try {
        dispatch({ type: "saving" });
        const preference = {
          mediaTypes: createMediaTypes(value as MediaTypesArr),
          theme,
        };
        await fuegoSetPreferences(user.uid, preference);
        if (cb) {
          cb();
        }
        dispatch({
          type: "savedPreference",
          payload: preference,
        });
      } catch (e) {
        throw `[UserNew]: Failed to setPreference ${e}`;
      }
    } else {
      setError("Select at least 1 mediaType");
    }
  }
}
