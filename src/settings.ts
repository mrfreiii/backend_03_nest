import { config } from "dotenv";
config();

export const SETTINGS = {
  PORT: process.env.PORT || 5005,
  PATH: {
    USERS: "/users",
    BLOGS: "/blogs",
    POSTS: "/posts",
    COMMENTS: "/comments",
    TESTING: "/testing",
    // AUTH: '/auth',
    // RATE_LIMIT: '/rate-limit',
    // SECURITY: '/security',
  },
  // CREDENTIALS: {
  //   LOGIN: 'admin',
  //   PASSWORD: 'qwerty',
  // },
  // JWT_SECRET: 'some secret qwerty',
};
