import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React from "react";
import MdLoader from "../src/components/md/MdLoader";
import Welcome from "../src/components/Welcome";
import useFuegoUser from "../src/fuego/useFuegoUser";

export default function MainPage(): JSX.Element {
  const router = useRouter();
  const { user, isValidating } = useFuegoUser();
  const cookies = parseCookies();

  if (user === null || isValidating) {
    return <MdLoader />;
  } else if ((cookies?.fuegoPending || cookies?.fuegoNewUser) && user) {
    router.push("/new");
    return <MdLoader />;
  } else if (user) {
    router.push("/diary");
    return <MdLoader />;
  } else {
    return <Welcome />;
  }
}
