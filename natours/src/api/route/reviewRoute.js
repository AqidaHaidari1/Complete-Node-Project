import express from "express";

import {
  createReview,
  getAllReviews,
  getReview,
  deleteReview,
  setUserAndTourIds,
  updateReview,
} from "../../controller/tour/reviewsController.js";
import { restrictTo } from "../middleware/restrictTo.js";
import { protect } from "../middleware/protect.js";

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
