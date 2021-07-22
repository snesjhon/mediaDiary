import {
  Avatar,
  Box,
  Button,
  Code,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useMDState } from "@/config/store";
import { useFuegoDelete } from "./config";
import { SettingsUserPreference } from "./components";
import { MdModal } from "@/md";
import type { UserFuegoValidated } from "@/types";

function Settings({ user }: { user: UserFuegoValidated }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { preference } = useMDState();

  return (
    <Box
      py={4}
      borderLeftWidth={{ base: 0, md: "1px" }}
      borderRightWidth={{ base: 0, md: "1px" }}
      px={{ md: 8 }}
      minHeight="93vh"
    >
      <Heading mb={4}>Settings</Heading>
      <Divider mt={2} mb={3} />
      <Box mt={8} mb={12}>
        <Heading size="lg">Account</Heading>
        <Divider mt={2} mb={3} />
        <Flex alignItems="center">
          {user.photoURL && <Avatar src={user.photoURL} size="xl" />}
          <Box ml={6}>
            <Text fontWeight="semibold">{user.displayName}</Text>
            <Text color="gray.600">{user.email}</Text>
            <Text fontSize="sm" mt={5} color="gray.600">
              MediaDiary
              <Text as="span" fontStyle="italic">
                -ing
              </Text>{" "}
              since:{" "}
              <Text as="span" fontSize="sm" color="purple.700">
                {dayjs(user.metadata.creationTime).format("MMMM, YYYY")}
              </Text>
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Heading color="blue.600" size="lg">
          Preferences
        </Heading>
        <Divider mt={2} mb={3} />
        <Box mt={2} mb={12}>
          <SettingsUserPreference user={user} preference={preference} />
        </Box>
      </Box>
      <Box>
        <Heading color="red.600" size="lg">
          Danger Zone
        </Heading>
        <Divider mt={2} mb={3} />
        <Text mb={5}>
          Once you delete your account, there is no going back. Please be
          certain.
        </Text>
        <Button color="red.500" onClick={onOpen}>
          Delete your account
        </Button>
      </Box>

      <MdModal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Account"
        size="md"
      >
        <DeleteContent user={user} onClose={onClose} />
      </MdModal>
    </Box>
  );
}

function DeleteContent({
  user,
  onClose,
}: {
  user: UserFuegoValidated;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const { isDeleting, deleteUser } = useFuegoDelete();

  return (
    <>
      <Text>
        Are you absolutely sure you want to delete{" "}
        <Text as="span" fontWeight="semibold">
          {user.email}
        </Text>
        ?
      </Text>
      <Input
        onChange={handleChange}
        placeholder="Type in your email to confirm"
        mt={8}
        mb={2}
      />
      <Code>{user.email}</Code>
      <Flex pt={10}>
        <Button
          isLoading={isDeleting}
          onClick={deleteUser}
          loadingText="Deleting"
          colorScheme="red"
          isDisabled={value === user.email ? false : true}
          mr={4}
        >
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </Flex>
    </>
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    return setValue(event.target.value);
  }
}
export default Settings;
