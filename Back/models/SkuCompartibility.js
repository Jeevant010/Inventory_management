const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const SKUCompatibilitySchema = new Schema(
  {
    sku: { type: Types.ObjectId, ref: 'SKU', required: true, index: true },
    type_code: { type: String, required: true, index: true },
    constraints: { type: Map, of: String }
  },
  { timestamps: true }
);

SKUCompatibilitySchema.index({ sku: 1, type_code: 1 }, { unique: true });

const SKUCompatibility = mongoose.models.SKUCompatibility || mongoose.model('SKUCompatibility', SKUCompatibilitySchema);
module.exports = SKUCompatibility;