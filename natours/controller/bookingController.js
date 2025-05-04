import Stripe from "stripe";
import dotenv from "dotenv";
import Tour from "../models/tourModel.js";
import Booking from "../models/bookingModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} from "./handlerFactory.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/45/36/0f/caption.jpg?w=500&h=400&s=1",
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { user, tour, price } = req.query;

  if (!user && !tour && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);
