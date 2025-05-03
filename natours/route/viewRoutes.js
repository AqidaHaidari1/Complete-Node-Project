import express from "express";
import {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
} from "../controller/viewsController.js";
import { isLoggedIn, protect } from "../controller/authConroller.js";
import { createBookingCheckout } from "../controller/bookingController.js";

const router = express.Router();

router.use(isLoggedIn)

router.get("/",createBookingCheckout, isLoggedIn, getOverview);

router.get("/tour/:slug",isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);


router.post("/submit-user-data", protect, updateUserData);

export default router;
