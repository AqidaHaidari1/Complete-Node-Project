import { promisify } from "util";
import jwt from "jsonwebtoken";
import Session from "../../models/sessionModel.js";
import User from "../../models/userModel.js";

import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("you are not logged in, Please login to get access", 401),
    );
  }
  // 2- verififcation token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const validSession = await Session.findOne({
    userId: decoded.id,
    token: token,
  });

  if (!validSession) {
    return next(
      new AppError("Session expired or invalid. Please log in again.", 401),
    );
  }
  // 3- check if still user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("the user belonging to this token does no longer exist."),
    );
  }

  // 4- check if user changed password recently
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password, please try login again.",
        401,
      ),
    );
  }
  req.user = freshUser;
  res.locals.user = freshUser;
  req.token = token;
  next();
});
