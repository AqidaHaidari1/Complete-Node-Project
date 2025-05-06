import { catchAsync } from "../utils/catchAsync.js";
import Tour from "../models/tourModel.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Session from "../models/sessionModel.js";

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
    "default-src 'self' https: http: ws: blob:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://js.stripe.com https://api.mapbox.com blob:; " +
      "connect-src 'self' ws: http: https:; " +
      "worker-src 'self' blob:; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: blob: https:;",
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

export const getMySessions = catchAsync(async (req, res, next) => {
  console.log(req.session, "something");
  const sessions = await Session.find({ userId: req.session.userId });
  console.log(sessions, "here");
  res.render("userSession", { sessions, currentSessionId: req.session.id });
});

export const logOutDevice = catchAsync(async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const { sessionId } = req.body;
  if (sessionId !== req.session.id) {
    await Session.deleteOne({ sessionId });
  }
  res.redirect("/my-sessions");
});

export const logoutAllDevices = catchAsync(async (req, res, next) => {
  if (!req.session.userId) return res.redirect("/login");
  await Session.deleteMany({
    userId: req.session.userId,
    sessionId: { $ne: req.session.id },
  });
  res.redirect("/my-sessions");
});
