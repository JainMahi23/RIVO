// Placeholder controller for the Market domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getMarketPlaceholder(req, res, next) {
  try {
    res.json({ message: "Market endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
