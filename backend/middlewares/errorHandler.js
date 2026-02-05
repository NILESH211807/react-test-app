const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err) {
    return res.status(statusCode).json({
      message,
    });
  }

  next();
};

module.exports = errorHandler;
