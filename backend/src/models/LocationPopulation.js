
import mongoose from "mongoose";

const locationPopulationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      index: true
    },

    district: {
      type: String,
      index: true
    },

    subDistrict: {
      type: String,
      index: true
    },

    name: {
      type: String
    },

    townVillage: {
      type: String
    },

    population: {
      type: Number
    },

    malePopulation: {
      type: Number
    },

    femalePopulation: {
      type: Number
    },

    mainHouseholds: {
      type: Number
    },

    censusYear: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const LocationPopulation =
  mongoose.models.LocationPopulation ||
  mongoose.model("LocationPopulation", locationPopulationSchema);

export default LocationPopulation;
