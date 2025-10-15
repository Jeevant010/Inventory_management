import client from './client';

export async function predictDemand({ sku_id, sku_code, history, horizon = 1 }) {
  const res = await client.post('/ml/predict/demand', { sku_id, sku_code, history, horizon });
  return res.data.data;
}