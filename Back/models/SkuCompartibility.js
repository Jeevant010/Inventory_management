const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

// Fine-grained compatibility constraints per SKU and type_code
const SKUCompatibilitySchema = new Schema(
  {
    sku: { type: Types.ObjectId, ref: 'SKU', required: true, index: true },
    type_code: { type: String, required: true, index: true }, // TowerType.code or SubstationType.code
    constraints: {
      type: Map,
      of: String
      // examples:
      // "circuit_requirement": "DOUBLE",
      // "min_kv": "220",
      // "technology": "GIS"
    }
  },
  { timestamps: true }
);

SKUCompatibilitySchema.index({ sku: 1, type_code: 1 }, { unique: true });
module.exports = model('SKUCompatibility', SKUCompatibilitySchema);