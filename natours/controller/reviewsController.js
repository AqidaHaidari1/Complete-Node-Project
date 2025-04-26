import Review from "../models/reviewTour.js";
import { catchAsync } from "../utils/catchAsync.js";
import { createOne, deleteOne, getAll, getOne } from "./handlerFactory.js";

export const getAllReviews = getAll(Review);

export const setUserAndTourIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};
export const createReview = createOne(Review);

export const deleteReview = deleteOne(Review);

export const getReview = getOne(Review);
