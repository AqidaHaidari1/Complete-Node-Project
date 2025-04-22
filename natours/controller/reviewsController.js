import Review from "../models/reviewTour.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(new AppError("No tour found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      reviews,
    },
  });
});
