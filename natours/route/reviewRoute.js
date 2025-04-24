import express from "express";

import {
  createReview,
  getReview,
    deleteReview,
  setUserAndTourIds
} from "../controller/reviewsController.js";
import { restrictTo, protect } from "../controller/authConroller.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getReview)
  .post(protect, restrictTo("user"), setUserAndTourIds, createReview);
router.route("/:id").delete(deleteReview);

export default router;
