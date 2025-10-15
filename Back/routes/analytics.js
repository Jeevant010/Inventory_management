const router = require('express').Router();
const ctrl = require('../controllers/analytics');

// Overview counts
router.get('/overview', ctrl.overview);

// Distributions
router.get('/towers', ctrl.towerBreakdown);
router.get('/substations', ctrl.substationBreakdown);
router.get('/skus', ctrl.skuBreakdown);

// Required parts and gaps
router.get('/compatibility-gaps', ctrl.compatibilityGaps);
router.get('/required-parts', ctrl.requiredParts);

module.exports = router;