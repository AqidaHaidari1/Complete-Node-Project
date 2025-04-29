import express from "express";
import {
  getTour,
  getOverview,
  getLoginForm,
} from "../controller/viewsController.js";

const router = express.Router();

router.get("/", getOverview);

router.get("/tour/:slug", getTour);
router.get('/login', getLoginForm)

export default router;
