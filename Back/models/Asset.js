const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ASSET_TYPES = ['TOWER', 'SUBSTATION', 'TRANSFORMER', 'LINE_BAY'];

const AssetSchema = new Schema(
  {
    asset_type: { type: String, enum: ASSET_TYPES, required: true, index: true },
    type_code: { type: String, required: true }, // references TowerType.code or SubstationType.code by value
    voltage_class_kv: { type: Number }, // for line/tower
    voltage_levels_kv: [{ type: Number }], // for substations [high, low]
    location: {
      lat: { type: Number },
      lon: { type: Number },
      address: { type: String }
    },
    line_id: { type: String }, // for towers
    site_id: { type: String }, // for substations
    manufacturer: { type: String },
    model: { type: String },
    year: { type: Number },
    status: { type: String, enum: ['IN_SERVICE', 'SPARE', 'RETIRED'], default: 'IN_SERVICE', index: true },
    attributes: { type: Map, of: String }, // extra fields per asset
    // example tower attributes:
    // attributes.height_m, attributes.foundation_type, attributes.material, attributes.circuit_count
    // example substation attributes:
    // attributes.technology, attributes.busbar_scheme, attributes.N_1_capable
  },
  { timestamps: true }
);

AssetSchema.index({ type_code: 1 });
module.exports = model('Asset', AssetSchema);