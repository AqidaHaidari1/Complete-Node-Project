import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

import app from "./app.js";

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
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
