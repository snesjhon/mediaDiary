import { useIsBreakpoint } from "@/utils";
import React from "react";
import { ContentSidebarDesktop, ContentSidebarMobile } from "./components";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentSidebar({
  isOpen,
  onClose,
}: Props): JSX.Element {
  const isMd = useIsBreakpoint("md");
  return isMd ? (
    <ContentSidebarDesktop />
  ) : (
    <ContentSidebarMobile isOpen={isOpen} onClose={onClose} />
  );
}
