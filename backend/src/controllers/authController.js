// Placeholder controller for the Auth domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getAuthPlaceholder(req, res, next) {
  try {
    res.json({ message: "Auth endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
