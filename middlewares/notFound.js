// Import external module
const createError = require("http-errors");

// Not found middleware
const notFound = async (req, res, next) => {
  try {
    next(createError(404, "404 not found"));
  } catch (err) {
    next(err);
  }
};

// Export not found middleware
module.exports = notFound;
