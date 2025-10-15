const router = require('express').Router();
const ctrl = require('../controllers/prediction.controller');

// List predictions (filterable)
router.get('/', ctrl.list);

module.exports = router;