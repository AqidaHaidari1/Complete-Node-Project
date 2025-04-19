import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not assword upadte, please use this route /updateMyPassword",
        400,
      ),
    );
  }

  const filtredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async(req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false })
	res.status(204).json({
		status: 'success',
		data: null
	})
})

export const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "This rout not yet defined!",
  });
};
export const getUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "This rout not yet defined!",
  });
};
export const updateUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "This rout not yet defined!",
  });
};
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "This rout not yet defined!",
  });
};
export const createUser = (req, res) => {
  res.status(500).json({
    status: "err",
    message: "This rout not yet defined!",
  });
};
