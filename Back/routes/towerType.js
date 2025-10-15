const router = require('express').Router();
const ctrl = require('../controllers/towerType');
const validate = require('../middleware/validate');
const { objectIdParam, paginationValidators } = require('../validators/common');
const { createTowerType, updateTowerType } = require('../validators/towerType');

router.get('/', paginationValidators, validate, ctrl.list);
router.post('/', createTowerType, validate, ctrl.create);
router.get('/:id', objectIdParam('id'), validate, ctrl.get);
router.patch('/:id', objectIdParam('id'), updateTowerType, validate, ctrl.update);
router.delete('/:id', objectIdParam('id'), validate, ctrl.remove);

module.exports = router;