// Placeholder controller for the Loan domain.
// Controllers only: parse req -> call a service -> shape res.
// No business logic should live here.

export async function getLoanPlaceholder(req, res, next) {
  try {
    res.json({ message: "Loan endpoint placeholder" });
  } catch (err) {
    next(err);
  }
}
