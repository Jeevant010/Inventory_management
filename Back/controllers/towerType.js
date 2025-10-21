const TowerType = require('../models/TowerTypes');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base');

module.exports = {
  list: buildListHandler(TowerType, 'code'),
  get: buildGetHandler(TowerType),
  create: buildCreateHandler(TowerType),
  update: buildUpdateHandler(TowerType),
  remove: buildDeleteHandler(TowerType)
};