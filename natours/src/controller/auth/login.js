
import User from "../../models/userModel.js";
import { catchAsync } from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import { createSendToken } from "./createToken.js";

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email or password!"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password"));
  }

  createSendToken(user, 200, req, res);
});