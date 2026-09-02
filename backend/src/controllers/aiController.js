// Placeholder controller for the Ai domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getAiPlaceholder(req, res, next) {
  try {
    res.json({ message: "Ai endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
