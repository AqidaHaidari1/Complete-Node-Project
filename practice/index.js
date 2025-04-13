import express from "express";
import router from "./router.js";

const app = new express();

app.use(express.json());

app.use("/api/v1/file/", router)

app.listen(4000, () => {
	console.log(`App is running on port 4000`);
});