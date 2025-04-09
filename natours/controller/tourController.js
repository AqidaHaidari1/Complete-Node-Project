import fs from "fs";
const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours.json"));

export const getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		currentTime: req.currentTime,
		result: tours.length,
		data: {
			tours,
		},
	});
};

export const getTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);
	res.status(200).json({
		status: "success",
		data: {
			tour,
		},
	});
};

export const createTour = (req, res) => {
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

export const updateTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		res.status(404).json({
			err: "not found ID",
		});
	}
	res.status(200).json({ data: "updated!" });
};

export const deleteTour = (req, res) => {
	if (req.params.id * 1 > tours.length) {
		res.status(404).json({
			err: "not found ID",
		});
	}
	res.status(204).json({ data: "deleted!" });
};
