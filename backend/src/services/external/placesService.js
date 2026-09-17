const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OVERPASS_TIMEOUT_MS = 25000; // 25 seconds

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
 * Returns an empty array on failure (timeout, network error, API error)
 * so that market analysis can still proceed with demographic data alone.
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
  // Guard: if no valid coordinates, return empty
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    console.warn("getNearbyBusinesses: invalid coordinates, returning empty");
    return [];
  }

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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(
        `Overpass API returned ${response.status} — falling back to empty competitor list`
      );
      return [];
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
  } catch (err) {
    // AbortError = timeout, TypeError = network error, etc.
    console.warn(
      `Overpass API call failed (${err.name}: ${err.message}) — falling back to empty competitor list`
    );
    return [];
  }
}