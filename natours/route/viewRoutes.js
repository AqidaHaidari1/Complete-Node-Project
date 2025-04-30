import express from "express";
import {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
} from "../controller/viewsController.js";
import { isLoggedIn, protect } from "../controller/authConroller.js";

const router = express.Router();

router.use(isLoggedIn)

router.get("/",isLoggedIn, getOverview);

router.get("/tour/:slug",isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me",protect, getAccount);

export default router;
