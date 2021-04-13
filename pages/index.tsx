import "firebase/auth";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import MdLoader from "../src/components/md/MdLoader";
import UserNew from "../src/components/user/UserNew";
import Welcome from "../src/components/Welcome";
import useFuegoUser from "../src/fuego/useFuegoUser";
import { useSupaAuth } from "../src/supa/supaProvider";
// import fuego from "../src/fuego/fuego";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const cookies = parseCookies(context);
//   return {
//     props: {
//       fuegoPending:
//         typeof cookies.fuegoPending !== "undefined"
//           ? cookies.fuegoPending
//           : false,
//       fuegoNewUser: typeof cookies.fuegoNewUser !== "undefined" ? true : false,
//     },
//   };
// };

function App(): JSX.Element {
  const { user, userLoaded } = useSupaAuth();

  console.log(user, userLoaded);
  useEffect(() => {
    if (user) {
      Router.push("/home");
    }
  }, [user]);
  // const [isNewUser, setIsNewUser] = useState(fuegoNewUser);
  // const router = useRouter();
  // const { user, isValidating } = useFuegoUser();

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     console.log(event, session);
  //   });
  // }, []);
  // useEffect(() => {
  //   if (fuegoPending) {
  //     destroyCookie(undefined, "fuegoPending");
  //     fuego
  //       .auth()
  //       .getRedirectResult()
  //       .then(async ({ additionalUserInfo, user }) => {
  //         if (user !== null) {
  //           if (additionalUserInfo?.isNewUser) {
  //             setCookie(null, "fuegoNewUser", "true", {
  //               maxAge: 60 * 60,
  //               path: "/",
  //             });
  //             setIsNewUser(user);
  //           } else {
  //             router.push("/home");
  //           }
  //         }
  //       });
  //   }
  // }, [fuegoPending, router]);

  // if ((fuegoPending && user === null) || isValidating) {
  //   return <MdLoader />;
  // } else if ((fuegoPending || fuegoNewUser) && user && isNewUser) {
  //   destroyCookie(null, "fuegoNewUser");
  //   return <UserNew user={user} />;
  // } else if (user) {
  //   router.push("/home");
  //   return <MdLoader />;
  // } else {

  if (user || (user === null && userLoaded)) {
    return <MdLoader />;
  }
  return <Welcome />;
}

export default App;
