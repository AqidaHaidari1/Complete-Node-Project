import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("you are not logged in, Please login to get access", 401),
    );
  }
  // 2- verififcation token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   
    // 3- check if still user exist
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError('the user belonging to this token does no longer exist.'))
    }

    // 4- check if user changed password recently
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed the password, please try login again.', 401))
    }
    
  next();
});
