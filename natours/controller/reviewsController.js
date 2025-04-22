import Review from "../models/reviewTour.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getReview = catchAsync(async (req, res, next) => {
  const Reviews = await Review.find();

  if (!Reviews) {
    return next(new AppError("No tour found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      Reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const Reviews = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      Reviews,
    },
  });
});
