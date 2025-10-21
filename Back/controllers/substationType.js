const SubstationType = require('../models/SubstationType');
const {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
} = require('./base');

module.exports = {
  list: buildListHandler(SubstationType, 'code'),
  get: buildGetHandler(SubstationType),
  create: buildCreateHandler(SubstationType),
  update: buildUpdateHandler(SubstationType),
  remove: buildDeleteHandler(SubstationType)
};