import BusinessCategory from "../models/BusinessCategory.js";

export async function getBusinessCategories(req, res, next) {
  try {
    const categories = await BusinessCategory.find({
      active: true,
    }).sort({ name: 1 });

    res.json({
      categories,
    });
  } catch (err) {
    next(err);
  }
}