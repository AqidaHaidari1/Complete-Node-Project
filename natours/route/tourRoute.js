import express from "express";
const router = express.Router();

import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
    getToursStats,
  getMonthlyPlan
} from "../controller/tourController.js";

// router.param('id', checkID)
router.route("/get-monthly-plan/:year").get(getMonthlyPlan);
router.route("/get-tours-state").get(getToursStats);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
