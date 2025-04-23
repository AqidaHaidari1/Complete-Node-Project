import { body } from "express-validator";

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email!"),
  body("password").trim().notEmpty().withMessage("Password cannot be empty"),
];

export default validateLogin;