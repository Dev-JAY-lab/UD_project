const rateLimit = require("express-rate-limit");

// Auth rate limiter - stricter limits
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: "Too many login/signup attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

// Blog creation limiter - prevent spam
const blogLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 blogs per hour
  message:
    "You are creating too many blogs, please wait before creating another",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

// Comment limiter - prevent spam
const commentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 comments per minute
  message: "You are commenting too frequently, please wait a moment",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

module.exports = {
  authLimiter,
  apiLimiter,
  blogLimiter,
  commentLimiter,
};
