import express from "express";
import { getTour, getTours } from "../controller/viewsController.js";

const router = express.Router();

router.get("/overview", getTours);

router.get("/tour", getTour);

export default router;
