import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Tour from "../../models/tourModel.js";
import User from "../../models/userModel.js";
import Review from "../../models/reviewTour.js";

import fs from "fs";

configDotenv();

const db_password = process.env.DATABASE_PASSWORD;
const db = process.env.DATABASE.replace("<PASSWORD>", db_password);

mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("DB connected successfuly!");
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`./dev-data/data/tours.json`, "utf-8"),
);
const users = JSON.parse(
  fs.readFileSync(`./dev-data/data/users.json`, "utf-8"),
);
const reviews = JSON.parse(
  fs.readFileSync(`./dev-data/data/reviews.json`, "utf-8"),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
