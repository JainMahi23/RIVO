// Placeholder controller for the Finance domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getFinancePlaceholder(req, res, next) {
  try {
    res.json({ message: "Finance endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
