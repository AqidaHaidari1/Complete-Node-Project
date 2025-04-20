import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import tourRouter from "./route/tourRoute.js";
import userRouter from "./route/userRoute.js";
import { configDotenv } from "dotenv";
import { globalErrorController } from "./controller/errorController.js";
import AppError from "./utils/appError.js";

configDotenv();

const app = new express();

// global middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

app.use(express.json());
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

// 404 handler
app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error
app.use(globalErrorController);

export default app;
