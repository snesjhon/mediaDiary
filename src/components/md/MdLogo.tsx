import Link from "next/link";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { LogoIcon } from "@/icons";

function MdLogo({
  title,
  href,
}: {
  title: string;
  href?: string;
}): JSX.Element {
  const mdPurple = useColorModeValue("purple.700", "purple.200");
  return (
    <Flex align="center">
      <LogoIcon boxSize={5} mr={1} color={mdPurple} />
      {typeof href !== "undefined" ? (
        <Link href={href}>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            color={mdPurple}
            fontWeight="medium"
            cursor="pointer"
          >
            {title}
          </Text>
        </Link>
      ) : (
        <Text
          fontSize={{ base: "md", md: "xl" }}
          color={mdPurple}
          fontWeight="medium"
          cursor="pointer"
        >
          {title}
        </Text>
      )}
    </Flex>
  );
}

export default MdLogo;
