import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from "../../controller/user/userController.js";

import {
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../../controller/user/passwordController.js";

import { signUp } from "../../controller/auth/signUp.js";
import { login } from "../../controller/auth/login.js";
import { protect } from "../middleware/protect.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { restrictTo } from "../middleware/restrictTo.js";
import { logout } from "../../controller/auth/logout.js";

import validateLogin from "../../validators/auth.js";

router.route("/signup").post(signUp);
router.route("/login").post(validateLogin, validateRequest, login);
router.get("/logout", logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);

router.use(protect);
router.route("/updateMypassword").patch(updatePassword);
router.get("/me", getMe, getUser);

router.route("/updateMe").patch(uploadUserPhoto, resizeUserPhoto, updateMe);
router.route("/deleteMe").delete(deleteMe);

router.use(restrictTo);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
