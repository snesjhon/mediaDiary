import fuego from "../interfaces/fuego";
import nookies from "nookies";

function useLogin(): () => void {
  function login() {
    const provider = new fuego.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    fuego
      .auth()
      .setPersistence(fuego.auth.Auth.Persistence.LOCAL)
      .then(() => {
        nookies.set({}, "fuegoPending", "true", {});
        fuego.auth().signInWithRedirect(provider);
      });
  }
  return login;
}

export default useLogin;
