// Generic request-validation wrapper. Pass a schema with a .parse()
// method (e.g. zod) once validation libraries are added; for now this
// is a structural placeholder so routes have a consistent hook point.
export function validate(schema) {
  return (req, res, next) => {
    if (!schema) return next();
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({ message: "Validation failed", details: err.errors || err.message });
    }
  };
}
