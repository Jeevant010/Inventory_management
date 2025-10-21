const Prediction = require('../models/prediction');
const ModelRun = require('../models/modelRun');
const SKU = require('../models/Sku');

function linearRegression(x, y) {
  const n = x.length;
  if (n === 0) throw new Error('No data');
  const sumX = x.reduce((a,b)=>a+b,0);
  const sumY = y.reduce((a,b)=>a+b,0);
  const sumXX = x.reduce((a,b)=>a+b*b,0);
  const sumXY = x.reduce((a,xi,i)=>a+xi*y[i],0);
  const denom = (n*sumXX - sumX*sumX) || 1e-9;
  const m = (n*sumXY - sumX*sumY) / denom;
  const b = (sumY - m*sumX) / n;

  // r2
  const meanY = sumY / n;
  const ssTot = y.reduce((a,yi)=>a+(yi-meanY)**2,0);
  const ssRes = y.reduce((a,yi,i)=>a+(yi-(m*x[i]+b))**2,0);
  const r2 = ssTot > 0 ? 1 - ssRes/ssTot : 1;

  return { m, b, r2 };
}

async function predictDemand(req, res, next) {
  const start = Date.now();
  const payload = req.body; // { sku_id?, sku_code?, history: [{t?:string, y:number}], horizon?: number }
  const name = 'linear_regression_demand';
  const version = '0.1.0';

  let status = 'SUCCESS';
  let response_payload = null;
  let error = null;

  try {
    const { sku_id, sku_code, history = [], horizon = 1 } = payload;
    if (!history.length) return res.status(400).json({ error: 'history (array of y values) is required' });

    const y = history.map(p => Number(p.y));
    const x = history.map((_,i)=>i);
    const { m, b, r2 } = linearRegression(x, y);

    const nextX = x.length;
    const forecast = [];
    for (let h=1; h<=horizon; h++) {
      const xi = nextX + (h-1);
      forecast.push(Math.max(0, m*xi + b));
    }

    // Try to resolve SKU code and id if available
    let skuDoc = null;
    if (sku_id) {
      skuDoc = await SKU.findById(sku_id);
    } else if (sku_code) {
      skuDoc = await SKU.findOne({ sku_code });
    }

    const prediction = await Prediction.create({
      subject_type: 'SKU',
      subject_id: skuDoc?._id,
      subject_code: skuDoc?.sku_code || sku_code,
      task: 'DEMAND',
      model_name: 'linear_regression',
      model_version: version,
      value: forecast[0],
      unit: 'units/month',
      input_features: { history, m, b, r2, horizon }
    });

    response_payload = { forecast, r2, prediction_id: prediction._id };
    res.json({ data: response_payload });
  } catch (e) {
    status = 'ERROR';
    error = e.message || String(e);
    next(e);
  } finally {
    await ModelRun.create({
      name,
      version,
      status,
      request_payload: payload,
      response_payload,
      error,
      duration_ms: Date.now() - start
    }).catch(()=>{});
  }
}

module.exports = { predictDemand };