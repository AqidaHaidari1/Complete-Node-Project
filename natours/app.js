import express from "express";
import morgan from "morgan";
import tourRouter from "./route/tourRoute.js";
import userRouter from "./route/userRoute.js";
import { configDotenv } from "dotenv";
configDotenv();

const app = new express();

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
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
app.use("/api/v1/tours/", tourRouter);
app.use("/api/v1/users", userRouter);

export default app;
