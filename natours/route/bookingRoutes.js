import express from 'express'
import { getCheckoutSession } from "../controller/bookingController.js";
import { protect } from '../controller/authConroller.js';
const router = express.Router()

router.get('/checkout-sessions/:tourId',protect, getCheckoutSession)

export default router;