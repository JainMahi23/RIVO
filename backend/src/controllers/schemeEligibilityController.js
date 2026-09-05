import { findEligibleSchemes } from "../services/scheme/schemeEligibilityService.js";

export async function checkSchemeEligibility(req, res, next) {
  try {
    const {
      projectCost,
      marginCapital,
    } = req.body;

    if (
      projectCost === undefined ||
      marginCapital === undefined
    ) {
      return res.status(400).json({
        message:
          "Project cost and margin capital are required",
      });
    }

    const result =
      await findEligibleSchemes({
        projectCost: Number(projectCost),
        marginCapital: Number(marginCapital),
      });

    res.json(result);
  } catch (err) {
    next(err);
  }
}