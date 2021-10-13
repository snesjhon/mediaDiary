import { useIsBreakpoint } from "@/utils";
import { DrawerFooter } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import React from "react";

export default function ContentFooter({
  children,
}: PropsWithChildren<unknown>): JSX.Element {
  const isMd = useIsBreakpoint("md");
  return (
    <DrawerFooter
      borderTopWidth="1px"
      justifyContent="space-between"
      pb={isMd ? undefined : "12"}
    >
      {children}
    </DrawerFooter>
  );
}
