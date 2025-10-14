import client from './client';
import { toQuery } from './helpers';

export async function listSKUs({ page=1, limit=10, search='' } = {}) {
  const q = toQuery({ page, limit, sku_code: search });
  const res = await client.get(`/skus${q}`);
  return res.data;
}

export async function getSKU(id) {
  const res = await client.get(`/skus/${id}`);
  return res.data.data;
}

export async function createSKU(payload) {
  const res = await client.post('/skus', payload);
  return res.data.data;
}

export async function updateSKU(id, payload) {
  const res = await client.patch(`/skus/${id}`, payload);
  return res.data.data;
}

export async function deleteSKU(id) {
  const res = await client.delete(`/skus/${id}`);
  return res.data.data;
}