import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5005,
  PATH: {
    AUTH: "/auth",
    USERS: "/users",
    BLOGS: "/blogs",
    POSTS: "/posts",
    COMMENTS: "/comments",
    TESTING: "/testing",
    // RATE_LIMIT: '/rate-limit',
    // SECURITY: '/security',
  },
  CREDENTIALS: {
    LOGIN: "admin",
    PASSWORD: "qwerty",
  },
  JWT_SECRET: "some secret qwerty",
};
