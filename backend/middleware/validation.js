const { body, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Signup validation
const validateSignup = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, hyphens, and underscores",
    ),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Blog creation validation
const validateBlogCreate = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .escape(),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .escape(),
  body("topic")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Topic must be less than 50 characters")
    .escape(),
  handleValidationErrors,
];

// Comment validation
const validateComment = [
  body("text")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters")
    .escape(),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateBlogCreate,
  validateComment,
  handleValidationErrors,
};
