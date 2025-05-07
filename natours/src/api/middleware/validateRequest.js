import { validationResult } from "express-validator";
import AppError from "../../utils/appError.js";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors
      .array()
      .map((err) => err.msg)
      .join(". ");
    return next(new AppError(msg, 400));
  }
  next();
};
