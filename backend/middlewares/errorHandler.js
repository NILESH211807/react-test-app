const errorHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || res?.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    stack: err.stack,
  });
};

module.exports = errorHandler;
