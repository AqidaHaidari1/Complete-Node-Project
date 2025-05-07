import express from "express";
import {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
  getMySessions,
  logOutDevice,
  logoutAllDevices,
} from "../../controller/view/viewsController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import { protect } from "../middleware/protect.js";
import { createBookingCheckout } from "../../controller/tour/bookingController.js";

const router = express.Router();

router.get("/", createBookingCheckout, isLoggedIn, getOverview);

router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/me", protect, getAccount);

router.get("/my-tours", protect, getMyTours);

router.get("/my-sessions", protect, getMySessions);
router.post("/logout-device", protect, logOutDevice);
router.post("/logout-all-others", protect, logoutAllDevices);

router.post("/submit-user-data", protect, updateUserData);

export default router;
