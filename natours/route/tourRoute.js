import express from "express";
const router = express.Router();

import {getAllTours, getTour, createTour, updateTour, deleteTour, checkID} from '../controller/tourController.js'

router.param('id', checkID)
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
