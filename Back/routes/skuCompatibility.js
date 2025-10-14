const router = require('express').Router();
const ctrl = require('../controllers/skuCompatibility.controller');
const validate = require('../middleware/validate');
const { objectIdParam, paginationValidators } = require('../validators/common');
const { createSKUCompatibility, updateSKUCompatibility } = require('../validators/skuCompatibility.validators');

router.get('/', paginationValidators, validate, ctrl.list);
router.post('/', createSKUCompatibility, validate, ctrl.create);
router.get('/:id', objectIdParam('id'), validate, ctrl.get);
router.patch('/:id', objectIdParam('id'), updateSKUCompatibility, validate, ctrl.update);
router.delete('/:id', objectIdParam('id'), validate, ctrl.remove);

module.exports = router;