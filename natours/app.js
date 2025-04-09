import express from "express";
import fs from "fs";
import morgan from "morgan";

const app = new express();

//middleware
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
	console.log("hello from middleware");
	next();
});
app.use((req, res, next) => {
	req.currentTime = new Date().toISOString();
	console.log(req.currentTime);
	next();
});

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours.json"));

const getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		currentTime: req.currentTime,
		result: tours.length,
		data: {
			tours,
		},
	});
};

const getTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
};

const createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);
	fs.writeFile("./dev-data/data/tours.json", JSON.stringify(tours), (err) => {
		res.status(201).json({
			status: "sucsess",
			data: {
				tour: newTour,
			},
		});
	});
};

const updateTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		res.status(404).json({
			err: "not found ID",
		});
	}
	res.status(200).json({ data: "updated!" });
};

const deleteTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		res.status(404).json({
			err: "not found ID",
		});
	}
	res.status(204).json({ data: "deleted!" });
};

const getAllUsers = (req, res) => {
	res.status(500).json({
		status: "err",
		message: "This rout not yet defined!",
	});
};
const getUser = (req, res) => {
	res.status(500).json({
		status: "err",
		message: "This rout not yet defined!",
	});
};
const updateUser = (req, res) => {
	res.status(500).json({
		status: "err",
		message: "This rout not yet defined!",
	});
};
const deleteUser = (req, res) => {
	res.status(500).json({
		status: "err",
		message: "This rout not yet defined!",
	});
};
const createUser = (req, res) => {
	res.status(500).json({
		status: "err",
		message: "This rout not yet defined!",
	});
};
/*
app.get("/api/v1/tours", getAllTours);

app.get("/api/v1/tours/:id", getTour);

app.post("/api/v1/tours", createTour);

app.patch("/api/v1/tours/:id", updateTour);

app.delete("/api/v1/tours/:id", deleteTour);
*/

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

const port = 3000;
app.listen(port, () => {
	console.log("App is running on port 3000");
});
