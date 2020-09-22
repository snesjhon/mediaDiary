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
  Text,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/core";
import { useDocument } from "@nandorojo/swr-firestore";
import React from "react";
import { DiaryState, MediaTypes } from "../config/mediaTypes";
import useUser from "../utils/useUser";
import LogoIcon from "./Icons/LogoIcon";

function Sidebar({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useUser();
  const { data } = useDocument(user !== null ? `${user.email}/diary` : null);

  if (user !== null) {
    const { email, displayName, photoURL } = user;
    if (data) {
      const { exists, hasPendingWrites, id, ...restData }: any = data;
      const diaryData: DiaryState = restData;
      const dataCounts = Object.keys(diaryData).reduce(
        (a, c) => {
          if (typeof a[diaryData[c]["type"]] !== "undefined") {
            a[diaryData[c]["type"]] = ++a[diaryData[c]["type"]];
          } else {
            a[diaryData[c]["type"]] = 1;
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
                    mediaDiary
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
                <Button color="blue" onClick={logout}>
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
