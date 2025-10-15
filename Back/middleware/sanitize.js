function scrub(value) {
  if (value === '') return undefined; // drop empty strings
  if (Array.isArray(value)) return value.map(scrub).filter(v => v !== undefined);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const s = scrub(v);
      if (s !== undefined) out[k] = s;
    }
    return out;
  }
  return value;
}

function sanitizeEmptyStrings(req, _res, next) {
  if (req.body) req.body = scrub(req.body);
  if (req.query) req.query = scrub(req.query);
  next();
}

module.exports = sanitizeEmptyStrings;