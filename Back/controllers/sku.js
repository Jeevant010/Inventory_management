const SKU = require('../models/sku');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base');

module.exports = {
  list: buildListHandler(SKU, '-createdAt'),
  get: buildGetHandler(SKU),
  create: buildCreateHandler(SKU),
  update: buildUpdateHandler(SKU),
  remove: buildDeleteHandler(SKU)
};