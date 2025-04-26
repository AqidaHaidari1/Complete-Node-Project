import express from "express";

import {
    createReview,
    getAllReviews,
  getReview,
    deleteReview,
  setUserAndTourIds
} from "../controller/reviewsController.js";
import { restrictTo, protect } from "../controller/authConroller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setUserAndTourIds, createReview);
router.route("/:id").get(getReview).delete(deleteReview);

export default router;
