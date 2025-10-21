const router = require('express').Router();

// Entity routes
router.use('/tower-types', require('./towerType'));
router.use('/substation-types', require('./substationType'));
router.use('/skus', require('./sku'));
router.use('/sku-compatibilities', require('./skuCompatibility'));
router.use('/assets', require('./assets'));
router.use('/analytics', require('./analytics'));
router.use('/ml', require('./ml'));
router.use('/predictions', require('./prediction'));

// Debug: list all registered routes under /api/_routes
router.get('/_routes', (req, res) => {
  const stack = req.app._router?.stack || [];
  const routes = [];
  function parseStack(layer, prefix = '') {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .filter(m => layer.route.methods[m])
        .map(m => m.toUpperCase());
      routes.push({ path: prefix + layer.route.path, methods });
    } else if (layer.name === 'router' && layer.handle?.stack) {
      layer.handle.stack.forEach(l => parseStack(l, prefix));
    }
  }
  stack.forEach(l => parseStack(l));
  res.json({ routes });
});

module.exports = router;