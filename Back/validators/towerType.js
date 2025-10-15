const { body } = require('express-validator');
const { STRUCTURE_FORMS, TOWER_FUNCTIONS } = require('../models/towerType');

const createTowerType = [
  body('code').isString().trim().notEmpty(),
  body('structure_form').isIn(STRUCTURE_FORMS),
  body('function').isIn(TOWER_FUNCTIONS),
  body('circuits_supported').optional().isIn([1, 2]),
  body('voltage_min_kv').isFloat({ gt: 0 }).toFloat(),
  body('voltage_max_kv').isFloat({ gt: 0 }).toFloat(),
  body('height_class').optional().isString(),
  body('material_grade').optional().isString(),
  body('foundation_type').optional().isString(),
  body('design_code').optional().isString(),
  body('notes').optional().isString()
];

const updateTowerType = createTowerType.map(rule => rule.optional({ nullable: true }));

module.exports = { createTowerType, updateTowerType };