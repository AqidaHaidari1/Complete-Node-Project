import express from "express";
import {
  getTour,
  getOverview,
  getLoginForm,
} from "../controller/viewsController.js";
import { protect } from "../controller/authConroller.js";

const router = express.Router();

router.get("/", getOverview);

router.get("/tour/:slug",protect, getTour);
router.get('/login', getLoginForm)

export default router;
