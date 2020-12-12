import Link from "next/link";
import { Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import LogoIcon from "../icons/LogoIcon";

function MdLogo({
  title,
  href,
}: {
  title: string;
  href?: string;
}): JSX.Element {
  const mdPurple = useColorModeValue("purple.700", "purple.200");
  return (
    <>
      <LogoIcon boxSize={5} mr={1} color={mdPurple} />
      {typeof href !== "undefined" ? (
        <Link href="/home">
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
    </>
  );
}

export default MdLogo;
