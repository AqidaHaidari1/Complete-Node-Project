import Tour from "../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = Tour.find(queryObj);

    // Execute Query
    const tours = await query;

    //Send Response
    res.status(200).json({
      status: "success",
      currentTime: req.currentTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //   const tour = await Tour.findOne({ _id: req.params.id })
    console.log(tour, "get tour");
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "sucsess",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid Data sent!",
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ data: tour, message: "Updated" });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204);
  } catch (err) {
    res.status(204).json({
      status: "fail",
      message: err,
    });
  }
};

export const checkID = (req, res, next, val) => {
  // console.log(`the tour id is: ${val}`)
  // if (val * 1 > tours.length) {
  // 	return	res.status(404).json({
  // 			err: "not found ID",
  // 		});
  // }
  // next()
};

// export const checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(404).json({
//             message: 'Missing Price Or Name!'
//         })
//     }

//     next()
// }
