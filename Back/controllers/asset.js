const Asset = require('../models/Asset');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base');

module.exports = {
  list: buildListHandler(Asset, '-createdAt'),
  get: buildGetHandler(Asset),
  create: buildCreateHandler(Asset),
  update: buildUpdateHandler(Asset),
  remove: buildDeleteHandler(Asset)
};