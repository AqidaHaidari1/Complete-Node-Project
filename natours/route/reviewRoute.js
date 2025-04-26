import express from "express";

import {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  setUserAndTourIds,
  updateReview,
} from "../controller/reviewsController.js";
import { restrictTo, protect } from "../controller/authConroller.js";

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setUserAndTourIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

export default router;
