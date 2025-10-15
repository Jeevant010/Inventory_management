const { param, query } = require('express-validator');
const mongoose = require('mongoose');

const objectIdParam = (name = 'id') =>
  param(name)
    .custom(val => mongoose.isValidObjectId(val))
    .withMessage('Invalid ObjectId');

const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 200 }).toInt(),
  query('sort').optional().isString(),
  query('order').optional().isIn(['asc', 'desc'])
];

module.exports = { objectIdParam, paginationValidators };