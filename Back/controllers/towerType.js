const TowerType = require('../models/towerType.model');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base.controller');

module.exports = {
  list: buildListHandler(TowerType, 'code'),
  get: buildGetHandler(TowerType),
  create: buildCreateHandler(TowerType),
  update: buildUpdateHandler(TowerType),
  remove: buildDeleteHandler(TowerType)
};