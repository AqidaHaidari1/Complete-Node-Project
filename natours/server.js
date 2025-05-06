import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

process.on("uncaughtException", (err) => {
  console.log("UncaughtException");
  console.log(err);
  process.exit(1);
});

import app from "./app.js";
// TODO: if the env variables do not exist, then a message should be shown on the terminal and the server should stop
const db_password = process.env.DATABASE_PASSWORD;
const db = process.env.DATABASE.replace("<PASSWORD>", db_password);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB connected successfuly!");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection!");
  console.log(err)
  server.close(() => {
    process.exit(1);
  });
});
