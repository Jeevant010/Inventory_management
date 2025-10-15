const router = require('express').Router();
const ctrl = require('../controllers/sku');
const validate = require('../middleware/validate');
const { objectIdParam, paginationValidators } = require('../validators/common');
const { createSKU, updateSKU } = require('../validators/sku');

router.get('/', paginationValidators, validate, ctrl.list);
router.post('/', createSKU, validate, ctrl.create);
router.get('/:id', objectIdParam('id'), validate, ctrl.get);
router.patch('/:id', objectIdParam('id'), updateSKU, validate, ctrl.update);
router.delete('/:id', objectIdParam('id'), validate, ctrl.remove);

module.exports = router;