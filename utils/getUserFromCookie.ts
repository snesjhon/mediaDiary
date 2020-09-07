import cookies from "js-cookie";

export function getUserFromCookie() {
  const cookie = cookies.get("auth");
  if (!cookie) {
    return;
  }
  return JSON.parse(cookie);
}

export function setUserCookie(user: any) {
  cookies.set("auth", user, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
  });
}

export function removeUserCookie() {
  return cookies.remove("auth");
}
