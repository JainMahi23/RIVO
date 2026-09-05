import { getNearbyBusinesses } from "../external/placesService.js";

/**
 * Generate market analysis for a location.
 */
export async function generateMarketAnalysis({
  latitude,
  longitude,
  population,
  households,
  radiusKm = 5,
}) {
  const competitors = await getNearbyBusinesses(
    latitude,
    longitude,
    radiusKm
  );

  const competitorCount = competitors.length;

  const averageDistanceKm =
    competitorCount > 0
      ? competitors.reduce(
          (sum, business) => sum + business.distanceKm,
          0
        ) / competitorCount
      : 0;

  let competitionLevel;

  if (competitorCount <= 5) {
    competitionLevel = "LOW";
  } else if (competitorCount <= 15) {
    competitionLevel = "MEDIUM";
  } else {
    competitionLevel = "HIGH";
  }

  let demandLevel;

  if (population >= 30000) {
    demandLevel = "HIGH";
  } else if (population >= 10000) {
    demandLevel = "MEDIUM";
  } else {
    demandLevel = "LOW";
  }

  let opportunityLevel;

  if (
    demandLevel === "HIGH" &&
    competitionLevel === "LOW"
  ) {
    opportunityLevel = "HIGH";
  } else if (competitionLevel === "HIGH") {
    opportunityLevel = "LOW";
  } else {
    opportunityLevel = "MEDIUM";
  }

  const marketReach = Math.round(population * 0.1);

  return {
    population,
    households,
    marketRadiusKm: radiusKm,
    competitors,
    competitorCount,
    competitionLevel,
    demandLevel,
    opportunityLevel,
    marketReach,
    analysisInputs: {
      population,
      households,
      competitorCount,
      averageDistanceKm: Number(
        averageDistanceKm.toFixed(2)
      ),
    },
    source: "OpenStreetMap + RIVO calculations",
    generatedAt: new Date(),
  };
}
