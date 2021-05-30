import {
  Divider,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import useIsBreakpoint from "../../utils/useIsBreakpoint";
import LogoIcon from "../icons/LogoIcon";

function LayoutFooter(): JSX.Element {
  const mdPurple = useColorModeValue("purple.700", "purple.200");
  const isMd = useIsBreakpoint("md");
  return (
    <>
      <Divider my={8} />
      {isMd ? (
        <Flex pb={10} justifyContent="space-between">
          <Flex align="center">
            <LogoIcon boxSize={8} mr={1} color={mdPurple} />
            <Text fontSize="2xl" color={mdPurple} fontWeight="medium">
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
      ) : (
        <>
          <HStack spacing={6} pb={6} fontSize="sm" justifyContent="center">
            <Text>Privacy Policy</Text>
            <Text>About</Text>
            <Text>FAQ</Text>
            <Text>Contact</Text>
          </HStack>
          <Flex justifyContent="space-between" pb={4}>
            <Flex align="center">
              <LogoIcon boxSize={5} mr={1} color={mdPurple} />
              <Text fontSize="lg" color={mdPurple} fontWeight="medium">
                mediaDiary
              </Text>
            </Flex>
            <Text fontSize="sm">2021 RedOak Studios</Text>
          </Flex>
        </>
      )}
    </>
  );
}

export default LayoutFooter;
