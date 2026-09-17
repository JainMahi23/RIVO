import Location from "../../models/Location.js";

/**
 * Search and paginate locations.
 *
 * @param {object} options
 * @param {string} [options.search]   - free-text search across state/district/village
 * @param {string} [options.state]    - exact state filter
 * @param {string} [options.district] - exact district filter
 * @param {string} [options.pincode]  - exact pincode filter
 * @param {number} [options.page]     - 1-based page number (default 1)
 * @param {number} [options.limit]    - results per page (default 20, max 100)
 */
export async function searchLocations({
  search,
  state,
  district,
  pincode,
  page = 1,
  limit = 20,
} = {}) {
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (state) {
    filter.state = new RegExp(state, "i");
  }

  if (district) {
    filter.district = new RegExp(district, "i");
  }

  if (pincode) {
    filter.pincode = pincode;
  }

  const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 100);
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * safeLimit;

  const [locations, total] = await Promise.all([
    Location.find(filter)
      .sort({ state: 1, district: 1, village: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Location.countDocuments(filter),
  ]);

  return {
    locations,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
}

/**
 * Get a single location by ID.
 */
export async function getLocationById(locationId) {
  return Location.findById(locationId).lean();
}

/**
 * Create a new location.
 */
export async function createLocation(data) {
  return Location.create(data);
}
