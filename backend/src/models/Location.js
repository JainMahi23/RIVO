import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subDistrict: {
      type: String,
      trim: true,
      index: true,
    },

    village: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
      index: true,
    },

    population: Number,
    malePopulation: Number,
    femalePopulation: Number,
    households: Number,

    censusYear: Number,

    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

// Text index for search
locationSchema.index({
  state: "text",
  district: "text",
  subDistrict: "text",
  village: "text",
});

export default mongoose.model("Location", locationSchema);