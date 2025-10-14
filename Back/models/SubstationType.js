const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PURPOSES = ['STEP_UP', 'STEP_DOWN', 'SWITCHING', 'DISTRIBUTION'];
const TECHNOLOGIES = ['AIS', 'GIS', 'HYBRID', 'RMU', 'PAD', 'MOBILE'];
const BUSBAR_SCHEMES = ['SINGLE', 'DOUBLE', 'RING', 'BREAKER_AND_A_HALF', 'MESH'];

const SubstationTypeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true }, // e.g., AIS-STEPDOWN-132/33
    purpose: { type: String, enum: PURPOSES, required: true },
    technology: { type: String, enum: TECHNOLOGIES, required: true },
    busbar_scheme: { type: String, enum: BUSBAR_SCHEMES },
    voltage_high_kv: { type: Number, required: true }, // e.g., 132
    voltage_low_kv: { type: Number }, // e.g., 33; optional for switching-only
    capacity_mva_min: { type: Number },
    capacity_mva_max: { type: Number },
    bays_in: { type: Number, default: 0 },
    bays_out: { type: Number, default: 0 },
    notes: { type: String }
  },
  { timestamps: true }
);

SubstationTypeSchema.index({ technology: 1, purpose: 1, voltage_high_kv: 1, voltage_low_kv: 1 });
module.exports = model('SubstationType', SubstationTypeSchema);