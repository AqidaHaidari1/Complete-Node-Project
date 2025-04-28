import express from "express";
import { getTour, getOverview } from "../controller/viewsController.js";

const router = express.Router();

router.get("/", getOverview);

router.get("/tour/:slug", getTour);

export default router;
