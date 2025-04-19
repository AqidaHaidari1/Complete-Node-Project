import express from "express";
const router = express.Router();
import { protect, restrictTo } from "../controller/authConroller.js";

import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
    getToursStats,
  getMonthlyPlan,
} from "../controller/tourController.js";

router.route("/get-monthly-plan/:year").get(getMonthlyPlan);
router.route("/get-tours-state").get(getToursStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default router;
