const SubstationType = require('../models/substationType.model');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base.controller');

module.exports = {
  list: buildListHandler(SubstationType, 'code'),
  get: buildGetHandler(SubstationType),
  create: buildCreateHandler(SubstationType),
  update: buildUpdateHandler(SubstationType),
  remove: buildDeleteHandler(SubstationType)
};