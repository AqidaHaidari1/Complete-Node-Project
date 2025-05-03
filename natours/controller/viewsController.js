import { catchAsync } from "../utils/catchAsync.js";
import Tour from "../models/tourModel.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

export const getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https: http: ws: blob:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://api.mapbox.com blob:; " +
      "connect-src 'self' ws: http: https:; " +
      "worker-src 'self' blob:; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: blob: https:;",
  );

  res.status(200).render("tour", {
    title: "The Forest Hicker Tour",
    tour,
  });
});

export const getLoginForm = catchAsync(async (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdn.jsdelivr.net",
  );

  res.status(200).render("login", {
    title: "Log in to your account!",
  });
});

export const getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
});

export const updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render("account", {
    title: "Your Account",
    user: updatedUser,
  });
});

export const getMyTours = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({ user: req.user.id });

  const tourIds = booking.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render("overview", {
    title: "My Bookings",
    tours,
  });
});
