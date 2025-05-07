import AppError from "../../utils/appError.js";

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