import express from "express";
import {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from "../../controller/tour/bookingController.js";

import { protect } from "../middleware/protect.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = express.Router();

router.use(protect);
router.get("/checkout-sessions/:tourId", getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
