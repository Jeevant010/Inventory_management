const Prediction = require('../models/Prediction');

async function list(req, res, next) {
  try {
    const { page = 1, limit = 20, subject_type, subject_id, task } = req.query;
    const q = {};
    if (subject_type) q.subject_type = subject_type;
    if (subject_id) q.subject_id = subject_id;
    if (task) q.task = task;
    const skip = (Number(page)-1) * Number(limit);
    const [items, total] = await Promise.all([
      Prediction.find(q).sort('-createdAt').skip(skip).limit(Number(limit)),
      Prediction.countDocuments(q)
    ]);
    res.json({ data: items, page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total/Number(limit)) });
  } catch (e) { next(e); }
}

module.exports = { list };