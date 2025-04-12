import Tour from "../models/tourModel.js";

export const getAllTours = (req, res) => {
	res.status(200).json({
		status: "success",
		currentTime: req.currentTime,
		// result: tours.length,
		// data: {
		// 	tours,
		// },
	});
};

export const getTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);
	res.status(200).json({
		status: "success",
		// data: {
		// 	tour,
		// },
	});
};

export const createTour = (req, res) => {
	res.status(201).json({
    status: "sucsess",
    // data: {
    //   tour: newTour,
    // },
  });
};

export const updateTour = (req, res) => {
	
	res.status(200).json({ data: "updated!" });
};

export const deleteTour = (req, res) => {
	res.status(204).json({ data: "deleted!" });
};

export const checkID = (req, res, next, val) => {
    // console.log(`the tour id is: ${val}`)
    // if (val * 1 > tours.length) {
	// 	return	res.status(404).json({
	// 			err: "not found ID",
	// 		});
    // }
    // next()
}

export const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(404).json({
            message: 'Missing Price Or Name!'
        })
    }

    next()
}