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
  // Log minimally to console
  if (process.env.NODE_ENV !== 'test') {
    const code = err.code || err.status || '';
    console.error('❌ Error:', err.name, code, '-', err.message);
  }

  // Validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Cast errors (e.g., bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Invalid value for ${err.path}` });
  }

  // Duplicate key errors
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    return res.status(409).json({ error: `Duplicate value for unique field(s): ${fields.join(', ')}` });
  }

  // Default
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = { notFound, errorHandler };