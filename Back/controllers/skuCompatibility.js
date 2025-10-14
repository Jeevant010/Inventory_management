const SKUCompatibility = require('../models/skuCompatibility.model');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base.controller');

module.exports = {
  list: buildListHandler(SKUCompatibility, '-createdAt'),
  get: buildGetHandler(SKUCompatibility, 'sku'),
  create: buildCreateHandler(SKUCompatibility),
  update: buildUpdateHandler(SKUCompatibility),
  remove: buildDeleteHandler(SKUCompatibility)
};