import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/core";
import { fuego, useCollection } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React from "react";
import { DiaryAdd, MediaTypes } from "../config/mediaTypes";
import { useAuth } from "../utils/auth";
import LogoIcon from "./Icons/LogoIcon";

function Sidebar({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element | null {
  const { user } = useAuth();
  const router = useRouter();
  const { data } = useCollection<DiaryAdd>(
    user !== null && user ? `${user.email}` : null
  );

  if (user !== null && user) {
    const { email, displayName, photoURL } = user;
    if (data) {
      const dataCounts = data.reduce(
        (a, c) => {
          if (typeof a[c.type] !== "undefined") {
            a[c.type] = ++a[c.type];
          } else {
            a[c.type] = 1;
          }
          return a;
        },
        { movie: 0, tv: 0, album: 0 }
      );

      return (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay sx={{ zIndex: 2 }}>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" py={3}>
                <Flex alignItems="center">
                  <LogoIcon boxSize={5} mr={1} />
                  <Text color="purple.700" fontWeight="medium">
                    Settings
                  </Text>
                </Flex>
              </DrawerHeader>
              <DrawerBody mt={4}>
                <Center>
                  {photoURL !== null && <Avatar src={photoURL} size="xl" />}
                </Center>
                <Box textAlign="center">
                  {displayName !== null && (
                    <Text fontSize="2xl" fontWeight="semibold">
                      {displayName}
                    </Text>
                  )}
                  {email !== null && (
                    <Text fontSize="sm" color="gray.600">
                      {email}
                    </Text>
                  )}
                </Box>
                <Divider my={4} />
                <Text>Night mode and Light Mode</Text>
                <Text>Delete your Account</Text>
                <Flex justifyContent="space-between">
                  {Object.keys(dataCounts).map((e) => (
                    <Stat key={`stat_${e}`}>
                      <StatLabel>{e.toUpperCase()}</StatLabel>
                      <StatNumber>{dataCounts[e as MediaTypes]}</StatNumber>
                    </Stat>
                  ))}
                </Flex>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="blue"
                  onClick={() => {
                    return fuego
                      .auth()
                      .signOut()
                      .then(() => {
                        return router.push("/");
                      })
                      .catch(() => {
                        return console.error("logout failed");
                      });
                  }}
                >
                  Logout
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      );
    } else {
      return <div>loading</div>;
    }
  } else {
    console.log("error with user");
    return null;
  }
}

export default Sidebar;
