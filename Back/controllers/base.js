const asyncHandler = require('../utils/asyncHandler');

function buildListHandler(Model, defaultSort = '-createdAt') {
  return asyncHandler(async (req, res) => {
    const MAX_PAGE_LIMIT = Number(process.env.MAX_PAGE_LIMIT || 1000);

    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.max(1, Math.min(Number(req.query.limit || 20), MAX_PAGE_LIMIT));

    const sortField = req.query.sort || defaultSort;
    const order = req.query.order;
    const parsedSort = order ? `${order === 'desc' ? '-' : ''}${sortField}` : sortField;

    // Build filters (exclude control params)
    const { page: _p, limit: _l, sort: _s, order: _o, ...filters } = req.query;
    Object.keys(filters).forEach(k => {
      if (filters[k] === '' || filters[k] === undefined) delete filters[k];
    });

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Model.find(filters).sort(parsedSort).skip(skip).limit(limit),
      Model.countDocuments(filters)
    ]);

    res.json({ data: items, page, limit, total, totalPages: Math.ceil(total / limit) });
  });
}

function buildGetHandler(Model, populate = '') {
  return asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id).populate(populate);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  });
}

function buildCreateHandler(Model) {
  return asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ data: item });
  });
}

function buildUpdateHandler(Model) {
  return asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  });
}

function buildDeleteHandler(Model) {
  return asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: { deleted: true } });
  });
}

module.exports = {
  buildListHandler,
  buildGetHandler,
  buildCreateHandler,
  buildUpdateHandler,
  buildDeleteHandler
};