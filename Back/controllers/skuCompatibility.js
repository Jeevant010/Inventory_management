const SKUCompatibility = require('../models/SkuCompartibility');

const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base');

module.exports = {
  list: buildListHandler(SKUCompatibility, '-createdAt'),
  get: buildGetHandler(SKUCompatibility, 'sku'),
  create: buildCreateHandler(SKUCompatibility),
  update: buildUpdateHandler(SKUCompatibility),
  remove: buildDeleteHandler(SKUCompatibility)
};