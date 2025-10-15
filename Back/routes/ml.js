const router = require('express').Router();
const ctrl = require('../controllers/ml');

// Predict SKU demand via simple linear regression on provided history
router.post('/predict/demand', ctrl.predictDemand);

module.exports = router;