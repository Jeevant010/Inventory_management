const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/_models', (_req, res) => {
  res.json({ models: Object.keys(mongoose.models) });
});

module.exports = router;