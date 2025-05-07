
import User from "../../models/userModel.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { createSendToken } from "./createToken.js";

export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, req, res);
});