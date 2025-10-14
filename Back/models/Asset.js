const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ASSET_TYPES = ['TOWER', 'SUBSTATION', 'TRANSFORMER', 'LINE_BAY'];

const AssetSchema = new Schema(
  {
    asset_type: { type: String, enum: ASSET_TYPES, required: true, index: true },
    type_code: { type: String, required: true }, // references TowerType.code or SubstationType.code
    voltage_class_kv: { type: Number },
    voltage_levels_kv: [{ type: Number }],
    location: {
      lat: { type: Number },
      lon: { type: Number },
      address: { type: String }
    },
    line_id: { type: String },
    site_id: { type: String },
    manufacturer: { type: String },
    model: { type: String },
    year: { type: Number },
    status: { type: String, enum: ['IN_SERVICE', 'SPARE', 'RETIRED'], default: 'IN_SERVICE', index: true },
    attributes: { type: Map, of: String }
  },
  { timestamps: true }
);

AssetSchema.index({ type_code: 1 });
module.exports = model('Asset', AssetSchema);
module.exports.ASSET_TYPES = ASSET_TYPES;