import React from "react";
import useIsBreakpoint from "../../../../utils/useIsBreakpoint";
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
