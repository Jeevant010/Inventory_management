const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ModelRunSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "linear_regression_demand"
    version: { type: String, default: '0.1.0' },
    status: { type: String, enum: ['SUCCESS', 'ERROR'], required: true },
    request_payload: { type: Schema.Types.Mixed },
    response_payload: { type: Schema.Types.Mixed },
    error: { type: String },
    duration_ms: { type: Number }
  },
  { timestamps: true }
);

module.exports = model('ModelRun', ModelRunSchema);