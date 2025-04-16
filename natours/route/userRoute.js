import express from "express";
const router = express.Router();

import {getAllUsers, getUser, createUser, updateUser, deleteUser} from '../controller/userController.js'
import { signUp, login } from "../controller/authConroller.js";

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;