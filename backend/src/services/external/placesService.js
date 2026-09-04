const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Calculate distance between two coordinates using Haversine formula.
 * Returns distance in kilometers.
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

/**
 * Fetch nearby businesses from OpenStreetMap.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radiusKm
 * @param {string} category
 */
export async function getNearbyBusinesses(
  latitude,
  longitude,
  radiusKm = 5,
  category = "shop"
) {
  const radiusMeters = radiusKm * 1000;

  const query = `
    [out:json][timeout:25];

    (
      node["shop"](around:${radiusMeters},${latitude},${longitude});
      way["shop"](around:${radiusMeters},${latitude},${longitude});
      node["amenity"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"](around:${radiusMeters},${latitude},${longitude});
    );

    out center tags;
  `;

  const response = await fetch(OVERPASS_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json",
    "User-Agent": "RIVO-MVP/1.0",
  },
    body: new URLSearchParams({
      data: query,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenStreetMap API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  const businesses = data.elements
    .map((element) => {
      const tags = element.tags || {};

      // Nodes have lat/lon directly.
      // Ways usually have a center returned by Overpass.
      const businessLatitude =
        element.lat ?? element.center?.lat;

      const businessLongitude =
        element.lon ?? element.center?.lon;

      if (
        businessLatitude === undefined ||
        businessLongitude === undefined
      ) {
        return null;
      }

      const name =
        tags.name ||
        tags.brand ||
        tags.operator ||
        "Unnamed business";

      const businessCategory =
        tags.shop ||
        tags.amenity ||
        category;

      const distanceKm = calculateDistanceKm(
        latitude,
        longitude,
        businessLatitude,
        businessLongitude
      );

      return {
        name,
        category: businessCategory,
        latitude: businessLatitude,
        longitude: businessLongitude,
        distanceKm: Number(distanceKm.toFixed(2)),
        source: "OpenStreetMap",
        externalId: String(element.id),
      };
    })
    .filter(Boolean);

  return businesses;
}