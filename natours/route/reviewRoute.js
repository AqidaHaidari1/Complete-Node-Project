import express from "express";

import {
  createReview,
  getReview,
  deleteReview,
} from "../controller/reviewsController.js";
import { restrictTo, protect } from "../controller/authConroller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReview)
  .post(protect, restrictTo("user"), createReview);
router.route("/:id").delete(deleteReview);

export default router;
