import { generateMarketAnalysis } from "./index.js";

const result = await generateMarketAnalysis({
  latitude: 23.0175,
  longitude: 76.7203,
  population: 50000,
  households: 10000,
  radiusKm: 5,
});

console.log(JSON.stringify(result, null, 2));