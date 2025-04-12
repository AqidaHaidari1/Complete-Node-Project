import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  name: { type: String, required: [true, "A tour must have a name!"] },
  rating: { type: Number, default: 4 },
  price: Number,
});

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
