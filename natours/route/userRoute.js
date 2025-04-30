import express from "express";
const router = express.Router();

import {getAllUsers, getUser, createUser, updateUser, deleteUser, updateMe, deleteMe, getMe} from '../controller/userController.js'
import { signUp, login, forgotPassword, resetPassword, protect, updatePassword, validateRequest, restrictTo, logout } from "../controller/authConroller.js";

import validateLogin from "../validators/auth.js";

router.route("/signup").post(signUp);
router.route("/login").post(validateLogin, validateRequest, login);
router.get("/logout", logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.use(protect)
router.route("/updateMypassword").patch(updatePassword);
router.get('/me',getMe, getUser)

router.route("/updateMe").patch(updateMe);
router.route("/deleteMe").delete(deleteMe);

router.use(restrictTo);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;