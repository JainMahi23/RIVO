import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
    },

   
    district: {
      type: String,
      required: true,
      trim: true,
    },

    subDistrict: {
      type: String,
      trim: true,
    },

    village: {
      type: String,
      trim: true,
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


export default mongoose.model("Location", locationSchema);