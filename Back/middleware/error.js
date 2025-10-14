const mongoose = require('mongoose');

// 404
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// Centralized error handler
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  let status = err.status || 500;
  let message = err.message || 'Server Error';

  // Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(status).json({ error: message, details });
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
    return res.status(status).json({ error: message });
  }

  // Duplicate key error
  if (err.code === 11000) {
    status = 409;
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `Duplicate value for unique field(s): ${fields.join(', ')}`;
    return res.status(status).json({ error: message });
  }

  res.status(status).json({
    error: message
  });
}

module.exports = { notFound, errorHandler };