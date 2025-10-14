const asyncHandler = require('../utils/asyncHandler');

function buildListHandler(Model, defaultSort = '-createdAt') {
  return asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      sort = defaultSort,
      order = undefined,
      ...filters
    } = req.query;

    const parsedSort = order ? `${order === 'desc' ? '-' : ''}${sort}` : sort;

    // Clean empty filters
    Object.keys(filters).forEach(k => {
      if (filters[k] === '' || filters[k] === undefined) delete filters[k];
    });

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Model.find(filters).sort(parsedSort).skip(skip).limit(Number(limit)),
      Model.countDocuments(filters)
    ]);

    res.json({
      data: items,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    });
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