const { body } = require('express-validator');

const createSKUCompatibility = [
  body('sku').isString().trim().notEmpty(),
  body('type_code').isString().trim().notEmpty(),
  body('constraints').optional().isObject()
];

const updateSKUCompatibility = createSKUCompatibility.map(rule => rule.optional({ nullable: true }));

module.exports = { createSKUCompatibility, updateSKUCompatibility };