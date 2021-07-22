import { useFuegoUser } from "@/fuego";
import { MdStatus, MdLogo } from "@/md";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { FiltersContent } from "./components";
import { fuegoFiltersAll } from "./config";
import type { FilterData } from "./config";

export default function Filters({
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const { user } = useFuegoUser();

  const { data, error } = useSWR<FilterData>(
    user && user !== null ? ["/filters/all", user.uid] : null,
    fuegoFiltersAll,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) {
    console.error(error);
    return <MdStatus title="There was an Error" />;
  }

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay sx={{ zIndex: 2 }}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pt={3} pb={2}>
            <MdLogo title="Filters" />
          </DrawerHeader>
          {data ? (
            <FiltersContent data={data} onClose={onClose} />
          ) : (
            <DrawerBody px={{ base: 0, sm: 8 }}>
              <MdStatus title="No Memories" />
            </DrawerBody>
          )}
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
