const router = require('express').Router();
const ctrl = require('../controllers/substationType.controller');
const validate = require('../middleware/validate');
const { objectIdParam, paginationValidators } = require('../validators/common');
const { createSubstationType, updateSubstationType } = require('../validators/substationType.validators');

router.get('/', paginationValidators, validate, ctrl.list);
router.post('/', createSubstationType, validate, ctrl.create);
router.get('/:id', objectIdParam('id'), validate, ctrl.get);
router.patch('/:id', objectIdParam('id'), updateSubstationType, validate, ctrl.update);
router.delete('/:id', objectIdParam('id'), validate, ctrl.remove);

module.exports = router;