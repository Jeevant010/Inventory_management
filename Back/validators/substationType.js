const { body } = require('express-validator');
const { PURPOSES, TECHNOLOGIES, BUSBAR_SCHEMES } = require('../models/substationType');

const createSubstationType = [
  body('code').isString().trim().notEmpty(),
  body('purpose').isIn(PURPOSES),
  body('technology').isIn(TECHNOLOGIES),
  body('busbar_scheme').optional().isIn(BUSBAR_SCHEMES),
  body('voltage_high_kv').isFloat({ gt: 0 }).toFloat(),
  body('voltage_low_kv').optional().isFloat({ gt: 0 }).toFloat(),
  body('capacity_mva_min').optional().isFloat({ gt: 0 }).toFloat(),
  body('capacity_mva_max').optional().isFloat({ gt: 0 }).toFloat(),
  body('bays_in').optional().isInt({ min: 0 }).toInt(),
  body('bays_out').optional().isInt({ min: 0 }).toInt(),
  body('notes').optional().isString()
];

const updateSubstationType = createSubstationType.map(rule => rule.optional({ nullable: true }));

module.exports = { createSubstationType, updateSubstationType };