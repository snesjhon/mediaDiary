import nookies from "nookies";

export function getUserFromCookie():
  | false
  | {
      [key: string]: string;
    } {
  const cookie = nookies.get(undefined, "token");
  if (!cookie) {
    return false;
  }
  return cookie;
}

export async function setUserCookie(user: firebase.User): Promise<void> {
  const id = await user.getIdToken();
  nookies.set(undefined, "token", id, {
    maxAge: 1 / 24,
  });
}

export function removeUserCookie(): void {
  nookies.destroy(undefined, "token");
}
