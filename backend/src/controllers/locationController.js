import {
  searchLocations,
  getLocationById as getLocationByIdService,
  createLocation as createLocationService,
} from "../services/location/locationService.js";

/**
 * POST /api/locations
 */
export async function createLocation(req, res, next) {
  try {
    const location = await createLocationService(req.body);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/locations?search=&state=&district=&pincode=&page=1&limit=20
 */
export async function getLocations(req, res, next) {
  try {
    const { search, state, district, pincode, page, limit } = req.query;

    const result = await searchLocations({
      search,
      state,
      district,
      pincode,
      page,
      limit,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/locations/:id
 */
export async function getLocationById(req, res, next) {
  try {
    const location = await getLocationByIdService(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
}