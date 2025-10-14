const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const STRUCTURE_FORMS = ['LATTICE', 'MONOPOLE', 'GUYED', 'CONCRETE_POLE', 'WOOD_POLE'];
const TOWER_FUNCTIONS = ['SUSPENSION', 'TENSION', 'TERMINAL', 'TRANSPOSITION', 'CROSSING'];

const TowerTypeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, index: true }, // e.g., LAT-SUSP-132
    structure_form: { type: String, enum: STRUCTURE_FORMS, required: true },
    function: { type: String, enum: TOWER_FUNCTIONS, required: true },
    circuits_supported: { type: Number, enum: [1, 2], default: 1 },
    voltage_min_kv: { type: Number, required: true },
    voltage_max_kv: { type: Number, required: true },
    height_class: { type: String }, // optional
    material_grade: { type: String },
    foundation_type: { type: String },
    design_code: { type: String }, // wind/ice loading standard
    notes: { type: String }
  },
  { timestamps: true }
);

TowerTypeSchema.index({ voltage_min_kv: 1, voltage_max_kv: 1 });
module.exports = model('TowerType', TowerTypeSchema);
module.exports.STRUCTURE_FORMS = STRUCTURE_FORMS;
module.exports.TOWER_FUNCTIONS = TOWER_FUNCTIONS;