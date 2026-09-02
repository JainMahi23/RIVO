import mongoose from "mongoose";

// Geographic/demographic reference data for an assessment's location.
const locationSchema = new mongoose.Schema(
  {
    village: String,
    block: String,
    district: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    population: Number,
    households: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
