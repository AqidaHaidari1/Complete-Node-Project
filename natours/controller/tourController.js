import Tour from "../models/tourModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import { deleteOne } from "./handlerFactory.js";

export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,summary,ratingsAverage,difficulty";

  console.log("Alias middleware:", req.query);
  next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
  //BUILD QUERY
  // const queryObj = req.aliasQuery ? { ...req.aliasQuery } : { ...req.query };
  // const excludedFields = ["page", "sort", "limit", "fields"];
  // excludedFields.forEach((el) => delete queryObj[el]);

  // // Convert query operators
  // const queryStr = JSON.stringify(queryObj);
  // const parsedQuery = JSON.parse(queryStr);

  // // Convert keys like 'price[lt]' to { price: { $lt: value } }
  // const mongoQuery = {};
  // for (let key in parsedQuery) {
  //   if (key.includes("[")) {
  //     const [field, operator] = key.split("[");
  //     const cleanOperator = operator.replace("]", "");
  //     if (!mongoQuery[field]) mongoQuery[field] = {};
  //     mongoQuery[field]["$" + cleanOperator] = parsedQuery[key];
  //   } else {
  //     mongoQuery[key] = parsedQuery[key];
  //   }
  // }

  // console.log(mongoQuery);
  // let query = Tour.find();
  // // filtring
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query.sort("-createdAt");
  // }
  // //limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v"); // excluding __v field
  // }
  // //paganition
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error("this page doesn't exist");
  // }

  const apiFeatures = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // Execute Query
  const tours = await apiFeatures.query;

  //Send Response
  res.status(200).json({
    status: "success",
    currentTime: req.currentTime,
    result: tours.length,
    data: {
      tours,
    },
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate( "reviews");
  //   const tour = await Tour.findOne({ _id: req.params.id })
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "sucsess",
    data: {
      tour: newTour,
    },
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({ data: tour, message: "Updated" });
});

export const deleteTour = deleteOne(Tour)

export const checkID = (req, res, next, val) => {
  // console.log(`the tour id is: ${val}`)
  // if (val * 1 > tours.length) {
  // 	return	res.status(404).json({
  // 			err: "not found ID",
  // 		});
  // }
  // next()
};

export const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.7 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: {
          $min: "$price",
        },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    //   {
    //     $match: { _id: { $ne: "EASY" } },
    //   },
  ]);
  console.log(stats, "statas");
  res.status(200).json({
    status: "success",
    result: stats.length,
    data: {
      stats,
    },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log(year);
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
