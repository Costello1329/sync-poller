export const apiUrl: string = "http://localhost:8000";

export const apiEndpoints = {
  user: "/user",
  authorization: "/authorize",
  logout: "/logout",
  poll: "/poll"
}

export const sessionCookie = {
  key: "session",
  expirationTime: 7 /// 7 days.
}

export const pollParameter = {
  key: "poll"
}
