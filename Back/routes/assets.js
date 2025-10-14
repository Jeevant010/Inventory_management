const router = require('express').Router();
const ctrl = require('../controllers/asset.controller');
const validate = require('../utils/validate');
const { objectIdParam, paginationValidators } = require('../validators/common');
const { createAsset, updateAsset } = require('../validators/asset.validators');

router.get('/', paginationValidators, validate, ctrl.list);
router.post('/', createAsset, validate, ctrl.create);
router.get('/:id', objectIdParam('id'), validate, ctrl.get);
router.patch('/:id', objectIdParam('id'), updateAsset, validate, ctrl.update);
router.delete('/:id', objectIdParam('id'), validate, ctrl.remove);

module.exports = router;