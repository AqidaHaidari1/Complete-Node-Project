import { catchAsync } from "../utils/catchAsync.js";
import Tour from "../models/tourModel.js";

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://api.mapbox.com; style-src 'self' https://fonts.googleapis.com https://api.mapbox.com; font-src https://fonts.gstatic.com; img-src 'self' data:",
  );

  res.status(200).render("tour", {
    title: "The Forest Hicker Tour",
    tour
  });
});

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in to your acccout!'
  })
})