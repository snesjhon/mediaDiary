import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import fuego from "../interfaces/fuego";

function useLogout(): () => void {
  const router = useRouter();

  function logout() {
    fuego
      .auth()
      .signOut()
      .then(() => {
        destroyCookie(null, "fuegoToken");
        return router.push("/");
      })
      .catch(() => {
        return console.error("logout failed");
      });
  }
  return logout;
}

export default useLogout;
