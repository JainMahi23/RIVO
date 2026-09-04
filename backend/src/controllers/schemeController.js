import Scheme from "../models/Scheme.js";

export async function getSchemes(req, res, next) {
  try {
    const schemes = await Scheme.find({
      active: true,
    }).sort({ projectCost: 1 });

    res.json({
      schemes,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSchemeById(req, res, next) {
  try {
    const scheme = await Scheme.findOne({
      _id: req.params.id,
      active: true,
    });

    if (!scheme) {
      return res.status(404).json({
        message: "Scheme not found",
      });
    }

    res.json({
      scheme,
    });
  } catch (err) {
    next(err);
  }
}