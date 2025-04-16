import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

const generateToken = (id) => {
  return jwt.sign({ id }, "secret-string", {
    expiresIn: "10d",
  });
};
export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = generateToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    user: newUser,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email or password!"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password"));
  }

  const token = generateToken(user._id);

  res.status(201).json({
    status: "success",
    token,
  });
});
