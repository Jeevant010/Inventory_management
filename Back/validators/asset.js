const { body } = require('express-validator');
const { ASSET_TYPES } = require('../models/asset.model');

const createAsset = [
  body('asset_type').isIn(ASSET_TYPES),
  body('type_code').isString().trim().notEmpty(),
  body('voltage_class_kv').optional().isFloat({ gt: 0 }).toFloat(),
  body('voltage_levels_kv').optional().isArray(),
  body('voltage_levels_kv.*').optional().isFloat({ gt: 0 }).toFloat(),
  body('location').optional().isObject(),
  body('location.lat').optional().isFloat({ min: -90, max: 90 }).toFloat(),
  body('location.lon').optional().isFloat({ min: -180, max: 180 }).toFloat(),
  body('location.address').optional().isString(),
  body('line_id').optional().isString(),
  body('site_id').optional().isString(),
  body('manufacturer').optional().isString(),
  body('model').optional().isString(),
  body('year').optional().isInt({ min: 1900, max: 3000 }).toInt(),
  body('status').optional().isIn(['IN_SERVICE', 'SPARE', 'RETIRED']),
  body('attributes').optional().isObject()
];

const updateAsset = createAsset.map(rule => rule.optional({ nullable: true }));

module.exports = { createAsset, updateAsset };