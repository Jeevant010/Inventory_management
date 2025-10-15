const Asset = require('../models/asset');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base.controller');

module.exports = {
  list: buildListHandler(Asset, '-createdAt'),
  get: buildGetHandler(Asset),
  create: buildCreateHandler(Asset),
  update: buildUpdateHandler(Asset),
  remove: buildDeleteHandler(Asset)
};