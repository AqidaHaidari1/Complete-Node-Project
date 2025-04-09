import express from "express";
const router = express.Router();

import {getAllTours, getTour, createTour, updateTour, deleteTour} from '../controller/tourController.js'

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
