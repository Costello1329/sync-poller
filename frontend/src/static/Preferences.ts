export const apiUrl: string = "http://0.0.0.0:8000";

export const apiEndpoints = {
  user: "/user/",
  authorization: "/authorize/",
  logout: "/logout/",
  poll: "/poll/",
  answer: "/answer/"
}

export const sessionCookie = {
  key: "session",
  expirationTime: 7 /// 7 days.
}

export const pollParameter = {
  key: "poll"
}

export const notificationsParameters = {
  kMaxNotificationTitleLength: 25,
  kMaxNotificationMessageLength: 50
}
