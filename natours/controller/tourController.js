import Tour from "../models/tourModel.js";

export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,summary,ratingsAverage,difficulty";

  console.log("Alias middleware:", req.query);
  next();
};


export const getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    const queryObj = req.aliasQuery ? { ...req.aliasQuery } : { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Convert query operators
    const queryStr = JSON.stringify(queryObj);
    const parsedQuery = JSON.parse(queryStr);

    // Convert keys like 'price[lt]' to { price: { $lt: value } }
    const mongoQuery = {};
    for (let key in parsedQuery) {
      if (key.includes("[")) {
        const [field, operator] = key.split("[");
        const cleanOperator = operator.replace("]", "");
        if (!mongoQuery[field]) mongoQuery[field] = {};
        mongoQuery[field]["$" + cleanOperator] = parsedQuery[key];
      } else {
        mongoQuery[key] = parsedQuery[key];
      }
    }

    console.log(mongoQuery);
    let query = Tour.find();
    // filtring
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }
    //limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // excluding __v field
    }
    //paganition
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // Execute Query
    const tours = await query;
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("this page doesn't exist");
    }
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
