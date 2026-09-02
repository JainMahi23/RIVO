// Placeholder controller for the Feasibility domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getFeasibilityPlaceholder(req, res, next) {
  try {
    res.json({ message: "Feasibility endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
