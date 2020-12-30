import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Text,
  useCheckboxGroup,
} from "@chakra-ui/react";
import React from "react";
import { MEDIA_TYPES } from "../../config/contants";
import Layout from "../layouts/Layout";

function NewUser(): JSX.Element {
  const { setValue, value } = useCheckboxGroup();
  return (
    <Layout>
      <Text>Hi, Welcome to MediaDiary</Text>
      <Text>Please choose from the options below</Text>
      <Box>
        <Text>I&apos;d like to track the following</Text>
        <CheckboxGroup
          onChange={(value) => setValue(value)}
          defaultValue={value}
        >
          {MEDIA_TYPES.map((e) => (
            <Checkbox key={`mediaType_${e}`} value={e}>
              {e}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Box>
      <Button>Click here to get started</Button>
    </Layout>
  );
}

export default NewUser;
