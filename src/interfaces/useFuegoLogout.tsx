import { useRouter } from "next/router";
import fuego from "./fuego";

function useFuegoLogout(): () => void {
  const router = useRouter();

  function logout() {
    fuego
      .auth()
      .signOut()
      .then(() => {
        return router.push("/");
      })
      .catch(() => {
        return console.error("logout failed");
      });
  }
  return logout;
}

export default useFuegoLogout;
