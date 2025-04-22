import express from "express";

const router = express.Router();
import { createReview, getReview } from "../controller/reviewsController.js";
import { restrictTo, protect } from "../controller/authConroller.js";

router
  .route("/")
  .get(getReview)
  .post(protect, restrictTo("user"), createReview);

export default router;
