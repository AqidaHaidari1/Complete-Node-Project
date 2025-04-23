import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

import tourRouter from "./route/tourRoute.js";
import userRouter from "./route/userRoute.js";
import reviewRouter from './route/reviewRoute.js'

import { configDotenv } from "dotenv";
import { globalErrorController } from "./controller/errorController.js";
import AppError from "./utils/appError.js";

configDotenv();

const app = new express();

// global middlewares

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "price",
      "ratingsAverage",
      "ratingsQuantity",
      "difficulty",
    ],
  }),
);

app.use(express.static(`./public`));

app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});
app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  console.log(req.currentTime);
  next();
});

//routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// 404 handler
app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error
app.use(globalErrorController);

export default app;
