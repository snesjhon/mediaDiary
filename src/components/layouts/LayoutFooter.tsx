import {
  Divider,
  Flex,
  Grid,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import LogoIcon from "../icons/LogoIcon";

function LayoutFooter(): JSX.Element {
  const mdPurple = useColorModeValue("purple.700", "purple.200");
  return (
    <>
      <Divider my={10} />
      <Flex pb={10} justifyContent="space-between">
        <Flex align="center">
          <LogoIcon boxSize={8} mr={1} color={mdPurple} />
          <Text
            fontSize={{ base: "md", md: "2xl" }}
            color={mdPurple}
            fontWeight="medium"
          >
            mediaDiary
          </Text>
        </Flex>
        <HStack spacing={8}>
          <Text>2021 RedOak Studios</Text>
          <Text>Privacy Policy</Text>
          <Text>About</Text>
          <Text>FAQ</Text>
          <Text>Contact</Text>
        </HStack>
      </Flex>
    </>
  );
}

export default LayoutFooter;
