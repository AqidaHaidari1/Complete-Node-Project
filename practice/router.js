import express from "express";
import { readCsvFile } from "./controller.js";

const router = express.Router();

router.route("/read-csv").get(readCsvFile);

export default router;