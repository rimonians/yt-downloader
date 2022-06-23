// Error handling middlewares
const errorHandling = async (err, req, res, next) => {
  try {
    const errCode = err.status ? err.status : 500;
    const errMessage = err.message ? err.message : "Something went wrong";
    res.status(errCode).render("error", { errCode, errMessage });
  } catch (err) {
    next(err);
  }
};

// Export error handling middleware
module.exports = errorHandling;
