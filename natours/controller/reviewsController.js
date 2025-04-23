import Review from "../models/reviewTour.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getReview = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

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
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  const reviews = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      reviews,
    },
  });
});
