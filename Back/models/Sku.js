const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const SKU_CATEGORIES = [
  'HARDWARE', 'INSULATOR', 'BREAKER', 'CT', 'PT', 'TRANSFORMER', 'RELAY', 'STEEL_MEMBER', 'BOLT', 'CABLE'
];
const COMPAT_ASSET_TYPES = ['TOWER', 'SUBSTATION'];

const SKUSchema = new Schema(
  {
    sku_code: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, enum: SKU_CATEGORIES, required: true },
    compatible_asset_type: { type: String, enum: COMPAT_ASSET_TYPES, required: true },
    compatible_type_codes: [{ type: String }],
    voltage_min_kv: { type: Number },
    voltage_max_kv: { type: Number },
    specs: { type: Map, of: String },
    uom: { type: String, default: 'EA' },
    serialization_required: { type: Boolean, default: false },
    lot_controlled: { type: Boolean, default: false },
    reorder_point: { type: Number, default: 0 },
    min_level: { type: Number, default: 0 },
    max_level: { type: Number, default: 0 },
    preferred_vendor_id: { type: Types.ObjectId, ref: 'Vendor' } 
  },
  { timestamps: true }
);

SKUSchema.index({ category: 1, compatible_asset_type: 1 });
module.exports = model('SKU', SKUSchema);
module.exports.SKU_CATEGORIES = SKU_CATEGORIES;
module.exports.COMPAT_ASSET_TYPES = COMPAT_ASSET_TYPES;