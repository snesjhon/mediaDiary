import React from "react";
import Charts from "../src/components/Charts";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import { useAuth } from "../src/config/auth";

function Activity(): JSX.Element {
  const { user } = useAuth();

  return !user ? (
    <MdLoader />
  ) : (
    <LayoutMain>
      <Charts user={user} />
    </LayoutMain>
  );
}

export default Activity;
