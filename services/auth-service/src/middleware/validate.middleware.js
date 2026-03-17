// services/auth-service/src/middleware/validate.middleware.js
exports.validate = (schema) => (req, res, next) => {
  try {

    schema.parse(req.body);

    next();

  } catch (error) {

    return res.status(400).json({
      error: "Invalid request data",
      details: error.errors
    });

  }
};