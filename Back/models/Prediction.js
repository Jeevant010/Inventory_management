const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const PredictionSchema = new Schema(
  {
    subject_type: { type: String, enum: ['SKU', 'ASSET'], required: true },
    subject_id: { type: Types.ObjectId, required: false }, // optional to allow code-only predictions
    subject_code: { type: String }, // e.g., sku_code (optional convenience)
    task: { type: String, enum: ['DEMAND', 'FAILURE_RISK'], required: true },
    model_name: { type: String, required: true }, // e.g., "linear_regression"
    model_version: { type: String, default: '0.1.0' },
    value: { type: Number, required: true }, // prediction value
    unit: { type: String, default: 'units/month' },
    input_features: { type: Schema.Types.Mixed }, // original features used
    tags: { type: Map, of: String }
  },
  { timestamps: true }
);

PredictionSchema.index({ subject_type: 1, task: 1, createdAt: -1 });
module.exports = model('Prediction', PredictionSchema);