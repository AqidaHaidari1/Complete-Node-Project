import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  sessionId: String,
  device: String,
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
