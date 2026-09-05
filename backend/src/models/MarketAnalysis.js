import mongoose from "mongoose";

const marketAnalysisSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },

    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    population: {
      type: Number,
      required: true,
    },

    households: {
      type: Number,
      required: true,
    },

    marketRadiusKm: {
      type: Number,
      required: true,
      default: 5,
    },

    competitors: [
      {
        name: String,
        category: String,
        latitude: Number,
        longitude: Number,
        distanceKm: Number,
        source: String,
        externalId: String,
      },
    ],

    competitorCount: {
      type: Number,
      required: true,
    },

    competitionLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    demandLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    opportunityLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    marketReach: {
      type: Number,
      required: true,
    },

    analysisInputs: {
      population: Number,
      households: Number,
      competitorCount: Number,
      averageDistanceKm: Number,
    },

    source: {
      type: String,
      default: "OpenStreetMap + RIVO calculations",
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MarketAnalysis", marketAnalysisSchema);
