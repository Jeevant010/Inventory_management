const { body } = require('express-validator');
const mongoose = require('mongoose');
const { SKU_CATEGORIES, COMPAT_ASSET_TYPES } = require('../models/sku');

const objectId = (val) => mongoose.isValidObjectId(val);

const createSKU = [
  body('sku_code').isString().trim().notEmpty(),
  body('description').isString().trim().notEmpty(),
  body('category').isIn(SKU_CATEGORIES),
  body('compatible_asset_type').isIn(COMPAT_ASSET_TYPES),
  body('compatible_type_codes').optional().isArray(),
  body('compatible_type_codes.*').optional().isString(),
  body('voltage_min_kv').optional().isFloat({ gt: 0 }).toFloat(),
  body('voltage_max_kv').optional().isFloat({ gt: 0 }).toFloat(),
  body('specs').optional().isObject(),
  body('uom').optional().isString(),
  body('serialization_required').optional().isBoolean(),
  body('lot_controlled').optional().isBoolean(),
  body('reorder_point').optional().isInt({ min: 0 }).toInt(),
  body('min_level').optional().isInt({ min: 0 }).toInt(),
  body('max_level').optional().isInt({ min: 0 }).toInt(),
  // Only validate when provided
  body('preferred_vendor_id')
    .optional({ nullable: true })
    .custom(val => objectId(val))
    .withMessage('preferred_vendor_id must be a valid ObjectId')
];

const updateSKU = createSKU.map(rule => rule.optional({ nullable: true }));

module.exports = { createSKU, updateSKU };