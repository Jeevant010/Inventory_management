const mongoose = require('mongoose');
const { Schema } = mongoose;

const PURPOSES = ['STEP_UP', 'STEP_DOWN', 'SWITCHING', 'DISTRIBUTION'];
const TECHNOLOGIES = ['AIS', 'GIS', 'HYBRID', 'RMU', 'PAD', 'MOBILE'];
const BUSBAR_SCHEMES = ['SINGLE', 'DOUBLE', 'RING', 'BREAKER_AND_A_HALF', 'MESH'];

const SubstationTypeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    purpose: { type: String, enum: PURPOSES, required: true },
    technology: { type: String, enum: TECHNOLOGIES, required: true },
    busbar_scheme: { type: String, enum: BUSBAR_SCHEMES },
    voltage_high_kv: { type: Number, required: true },
    voltage_low_kv: { type: Number },
    capacity_mva_min: { type: Number },
    capacity_mva_max: { type: Number },
    bays_in: { type: Number, default: 0 },
    bays_out: { type: Number, default: 0 },
    notes: { type: String }
  },
  { timestamps: true }
);

SubstationTypeSchema.index({ technology: 1, purpose: 1, voltage_high_kv: 1, voltage_low_kv: 1 });

const SubstationType = mongoose.models.SubstationType || mongoose.model('SubstationType', SubstationTypeSchema);
module.exports = SubstationType;
module.exports.PURPOSES = PURPOSES;
module.exports.TECHNOLOGIES = TECHNOLOGIES;
module.exports.BUSBAR_SCHEMES = BUSBAR_SCHEMES;