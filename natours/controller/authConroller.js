import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import sentEmail from "../utils/email.js";
import crypto from "crypto";
import useragent from "useragent";
import { validationResult } from "express-validator";
import Session from "../models/sessionModel.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

const createSendToken = async(user, statusCode,req, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  const deviceInfo = useragent.parse(req.headers["user-agent"]).toString();

  await Session.create({
    userId: user._id,
    token: token,
    device: deviceInfo,
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201,req, res);
});

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

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email or password!"));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password"));
  }

  createSendToken(user, 200,req, res);
});

export const logout = async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  await Session.deleteOne({ token: req.token });
  res.status(200).json({ status: "success" });
};

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
console.log(decoded, 'decod')
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

export const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      const validSession = await Session.findOne({
        userId: decoded.id,
        token: token,
      });

      if (!validSession) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
// TODO: why does the parameter "user admin role whatever role" changes to an array when you user ...role in argument
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You dont have permission to do this action", 403),
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with the email", 404));
  }

  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user email

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a patch request with your new passsword: ${resetURL}`;
  try {
    await sentEmail({
      email: user.email,
      subject: "your password reset token is valid for 10 mins.",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 201,req, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("your current passsword is wrong", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 201,req, res);
});
