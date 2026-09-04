import Location from "../models/Location.js";

export async function createLocation(req, res, next) {
  try {
    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: location,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLocations(req, res, next) {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLocationById(req, res, next) {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
}