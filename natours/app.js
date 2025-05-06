import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import tourRouter from "./route/tourRoute.js";
import userRouter from "./route/userRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import viewRouter from "./route/viewRoutes.js";
import bookingRouter from "./route/bookingRoutes.js";

import { configDotenv } from "dotenv";
import { globalErrorController } from "./controller/errorController.js";
import AppError from "./utils/appError.js";
import cookieParser from "cookie-parser";

configDotenv();

const app = new express();

app.set("view engine", "pug");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
// global middlewares

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(cors());

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

// TODO: make modificaiton to this line of code so this middleware only runs on POST and PUT, PATCH request
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// app.use(mongoSanitize());

// app.use(xss());

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

app.use(compression());
app.use((req, res, next) => {
  req.currentTime = new Date().toISOString();
  next();
});

//routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);

// 404 handler
app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error
app.use(globalErrorController);

export default app;
