import express from "express";
const router = express.Router();

import {getAllUsers, getUser, createUser, updateUser, deleteUser} from '../controller/userController.js'
import { signUp, login, forgotPassword, resetPassword, protect, updatePassword } from "../controller/authConroller.js";

router.route("/signup").post(signUp);
router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updateMypassword").patch(protect, updatePassword);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;