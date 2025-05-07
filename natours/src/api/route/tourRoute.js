import express from "express";
import { uploadTourImages, resizeTourImages } from "../../controller/tour/tourController.js";

const router = express.Router();

import { protect } from "../middleware/protect.js";
import { restrictTo } from "../middleware/restrictTo.js";

import reviewRouter from "./reviewRoute.js";
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} from "../../controller/tour/tourController.js";

// nested routes
// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

router.use("/:tourId/reviews", reviewRouter);

router.route("/get-monthly-plan/:year").get(getMonthlyPlan);
router
  .route("/get-tours-state")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getToursStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistances);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    restrictTo("admin", "lead-guide"),
    uploadTourImages,
    resizeTourImages,
    updateTour,
  )
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default router;
