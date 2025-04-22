import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can' be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to a user"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must be belong to a tour"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
