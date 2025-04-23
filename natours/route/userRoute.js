import express from "express";
const router = express.Router();

import {getAllUsers, getUser, createUser, updateUser, deleteUser, updateMe, deleteMe} from '../controller/userController.js'
import { signUp, login, forgotPassword, resetPassword, protect, updatePassword, validateRequest } from "../controller/authConroller.js";

import validateLogin from "../validators/auth.js";

router.route("/signup").post(signUp);
router.route("/login").post(validateLogin, validateRequest, login);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMypassword").patch(protect, updatePassword);

router.route("/updateMe").patch(protect, updateMe);
router.route("/deleteMe").delete(protect, deleteMe);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;