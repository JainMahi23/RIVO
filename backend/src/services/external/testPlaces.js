import { getNearbyBusinesses } from "./placesService.js";

const businesses = await getNearbyBusinesses(
  23.0175, // latitude
  76.7203, // longitude
  5        // radius in km
);

console.log("Nearby businesses found:", businesses.length);
console.log(businesses);